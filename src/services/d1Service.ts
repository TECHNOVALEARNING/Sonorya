import { Song, UserProfile, AdminAnalytics, PaymentTransaction } from '../types/melodia';

/**
 * Cloudflare D1 Database Integration Service for Sonorya by Technova
 * Database ID: c662159a-4425-4557-9087-f4e3390209be
 */

const STORAGE_SONGS_KEY = 'sonorya_d1_songs';
const STORAGE_USERS_KEY = 'sonorya_d1_users';
const STORAGE_PAYMENTS_KEY = 'sonorya_d1_payments';

export const cleanSongTitle = (rawTitle?: string): string => {
  if (!rawTitle) return '';
  let cleaned = rawTitle.replace(/[«»"]/g, '').trim();
  cleaned = cleaned.replace(/^(Encouragement|Mariage|Anniversaire|Baptême|Dot|Réussite|Hommage|Déclaration|Célébration)\s+de\s+/i, '');
  return cleaned.trim();
};

class D1DatabaseService {
  private songs: Song[] = [];
  private users: UserProfile[] = [];
  private payments: PaymentTransaction[] = [];

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    try {
      const savedSongs = localStorage.getItem(STORAGE_SONGS_KEY);
      const parsed: Song[] = savedSongs ? JSON.parse(savedSongs) : [];
      this.songs = parsed.filter(s => s.id && !s.id.startsWith('sample-'));

      // One-time migration: clear mismatched lyrics from old API-generated songs
      // Old songs used V3_5 model + wrong OpenAI key, so lyrics never matched audio
      const migrationKey = 'sonorya_lyrics_migration_v2';
      if (!localStorage.getItem(migrationKey)) {
        let migrated = false;
        for (const song of this.songs) {
          const isApiSong = song.audioUrl && (
            song.audioUrl.includes('cdn') ||
            song.audioUrl.includes('kie.ai') ||
            song.audioUrl.includes('suno') ||
            (song.audioUrl.startsWith('http') && !song.audioUrl.startsWith('/'))
          );
          if (isApiSong && song.lyrics) {
            song.lyrics = '';
            migrated = true;
          }
        }
        if (migrated) {
          this.saveSongs();
          console.log('[D1 MIGRATION] ✅ Cleared mismatched lyrics from old API-generated songs');
        }
        localStorage.setItem(migrationKey, 'done');
      }

      const savedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      this.users = savedUsers ? JSON.parse(savedUsers) : [];

      const savedPayments = localStorage.getItem(STORAGE_PAYMENTS_KEY);
      this.payments = savedPayments ? JSON.parse(savedPayments) : [];
    } catch (e) {
      this.songs = [];
      this.users = [];
      this.payments = [];
    }
  }

  private saveSongs() {
    try {
      localStorage.setItem(STORAGE_SONGS_KEY, JSON.stringify(this.songs));
    } catch (e) {}
  }

  private saveUsers() {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(this.users));
    } catch (e) {}
  }

  private savePayments() {
    try {
      localStorage.setItem(STORAGE_PAYMENTS_KEY, JSON.stringify(this.payments));
    } catch (e) {}
  }

  // --- SONG METHODS ---
  public async getSongs(userId?: string): Promise<Song[]> {
    const list = userId ? this.songs.filter(s => s.userId === userId) : [...this.songs];
    const unique: Song[] = [];
    const seenIds = new Set<string>();
    const seenTitles = new Set<string>();

    for (const rawSong of list) {
      const song = {
        ...rawSong,
        title: cleanSongTitle(rawSong.title)
      };
      const titleKey = song.title.toLowerCase();
      if (!seenIds.has(song.id) && (!titleKey || !seenTitles.has(titleKey))) {
        seenIds.add(song.id);
        if (titleKey) seenTitles.add(titleKey);
        unique.push(song);
      }
    }
    return unique;
  }

  public async saveSong(song: Song): Promise<Song> {
    const cleanSong = {
      ...song,
      title: cleanSongTitle(song.title)
    };
    const existingIndex = this.songs.findIndex(s => s.id === cleanSong.id);
    if (existingIndex >= 0) {
      this.songs[existingIndex] = { ...this.songs[existingIndex], ...cleanSong };
    } else {
      this.songs = [cleanSong, ...this.songs];
    }
    this.saveSongs();

    // Sync with Cloudflare D1 if Worker API is available
    try {
      await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(song)
      });
    } catch (e) {
      // Offline fallback
    }

    return song;
  }

  public async toggleFavorite(songId: string): Promise<boolean> {
    const song = this.songs.find(s => s.id === songId);
    if (song) {
      song.isFavorite = !song.isFavorite;
      this.saveSongs();
      return song.isFavorite;
    }
    return false;
  }

  public async deleteSong(songId: string): Promise<void> {
    this.songs = this.songs.filter(s => s.id !== songId);
    this.saveSongs();
  }

  // --- USER METHODS ---
  public async getUsers(): Promise<UserProfile[]> {
    return [...this.users];
  }

  public async saveUser(user: UserProfile): Promise<UserProfile> {
    const index = this.users.findIndex(u => u.id === user.id || u.email === user.email);
    if (index >= 0) {
      this.users[index] = { ...this.users[index], ...user };
    } else {
      this.users = [user, ...this.users];
    }
    this.saveUsers();

    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
    } catch (e) {
      // offline fallback
    }

    return user;
  }

  // --- ADMIN ANALYTICS ---
  public async getAdminAnalytics(): Promise<AdminAnalytics> {
    const totalSongs = this.songs.length;
    const totalUsers = this.users.length;
    const totalRevenueFcfa = this.songs.reduce((sum, s) => sum + (s.priceFcfa || 2500), 0);
    const totalDownloads = this.songs.reduce((sum, s) => sum + (s.downloadCount || 0), 0);

    return {
      totalUsers,
      activeUsersToday: Math.min(totalUsers, 1),
      totalRevenueFcfa,
      totalSongsGenerated: totalSongs,
      totalDownloads,
      recentPayments: []
    };
  }

  // --- PAYMENTS ---
  public async getPayments(): Promise<PaymentTransaction[]> {
    return [...this.payments];
  }

  public async savePayment(payment: PaymentTransaction): Promise<PaymentTransaction> {
    const existingIndex = this.payments.findIndex(p => p.id === payment.id);
    if (existingIndex >= 0) {
      this.payments[existingIndex] = { ...this.payments[existingIndex], ...payment };
    } else {
      this.payments = [payment, ...this.payments];
    }
    this.savePayments();

    // Sync with Cloudflare D1
    try {
      await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      });
    } catch (e) {
      // Offline fallback
    }

    return payment;
  }

  // --- PURGE ALL MOCK DATA ---
  public clearAllData() {
    this.songs = [];
    this.payments = [];
    this.saveSongs();
    this.savePayments();
    localStorage.removeItem('melodia_orders');
    localStorage.removeItem('melodia_songs_repo');
  }
}

export const d1Database = new D1DatabaseService();
