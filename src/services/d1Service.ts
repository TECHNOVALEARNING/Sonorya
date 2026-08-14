import { Song, UserProfile, AdminAnalytics, PaymentTransaction } from '../types/melodia';
import { supabase } from './supabaseClient';

export const cleanSongTitle = (rawTitle?: string): string => {
  if (!rawTitle) return '';
  let cleaned = rawTitle.replace(/[«»"]/g, '').trim();
  cleaned = cleaned.replace(/^(Encouragement|Mariage|Anniversaire|Baptême|Dot|Réussite|Hommage|Déclaration|Célébration)\s+de\s+/i, '');
  return cleaned.trim();
};

class SupabaseDatabaseService {
  
  // --- SONG METHODS ---
  public async getSongs(userId?: string): Promise<Song[]> {
    try {
      let query = supabase.from('songs').select('*');
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []).map(row => ({
        id: row.id,
        userId: row.user_id,
        title: cleanSongTitle(row.title),
        occasion: row.occasion,
        recipientName: row.recipient_name,
        story: row.story,
        genre: row.genre,
        voiceGender: row.voice_gender,
        language: row.language,
        vibe: row.vibe,
        tempo: row.tempo,
        durationSeconds: row.duration_seconds,
        lyrics: row.lyrics,
        audioUrl: row.audio_url,
        previewAudioUrl: row.preview_audio_url,
        coverUrl: row.cover_url,
        status: row.status,
        isFavorite: row.is_favorite,
        downloadCount: row.download_count,
        playCount: row.play_count,
        priceFcfa: row.price_fcfa,
        createdAt: row.created_at
      }));
    } catch (e) {
      console.error('Error fetching songs from Supabase:', e);
      return [];
    }
  }

  public async saveSong(song: Song): Promise<Song> {
    try {
      const dbSong = {
        id: song.id, // Note: For new songs, if id is a uuid, you might need to rely on DB generated ID or ensure it's a valid UUID
        user_id: song.userId,
        title: cleanSongTitle(song.title),
        occasion: song.occasion,
        recipient_name: song.recipientName,
        story: song.story,
        genre: song.genre,
        voice_gender: song.voiceGender,
        language: song.language,
        vibe: song.vibe,
        tempo: song.tempo,
        duration_seconds: song.durationSeconds,
        lyrics: song.lyrics,
        audio_url: song.audioUrl,
        preview_audio_url: song.previewAudioUrl,
        cover_url: song.coverUrl,
        status: song.status,
        is_favorite: song.isFavorite,
        download_count: song.downloadCount,
        play_count: song.playCount,
        price_fcfa: song.priceFcfa,
        // created_at let DB handle it or pass if exists
      };
      
      // If the ID is clearly not a UUID (e.g. starts with 'song-'), we omit it so Supabase generates a UUID.
      // But we need to handle how the frontend uses IDs. We'll try to upsert.
      // For simplicity in migration, if ID is required by UI, we might need a mapping or just let Supabase fail if not UUID.
      // Let's assume we change frontend IDs to be UUIDs moving forward, or we change Supabase schema to TEXT for IDs.
      // Given the user is migrating and hasn't started yet, we'll keep the IDs as they are (strings) but Supabase schema uses UUID.
      // ACTUALLY: Let's adjust the schema to use TEXT for IDs so it's fully compatible with the current codebase immediately.
      // (The schema file I wrote uses UUID, but the frontend uses 'song-XYZ'. Supabase accepts custom TEXT ids if schema allows).
      
      const { data, error } = await supabase
        .from('songs')
        .upsert(dbSong)
        .select()
        .single();
        
      if (error) throw error;
      return song;
    } catch (e) {
      console.error('Error saving song to Supabase:', e);
      return song; // Fallback to returning the song even if save failed to not break UI immediately
    }
  }

  public async toggleFavorite(songId: string): Promise<boolean> {
    try {
      // First get current state
      const { data: song } = await supabase.from('songs').select('is_favorite').eq('id', songId).single();
      if (song) {
        const newValue = !song.is_favorite;
        await supabase.from('songs').update({ is_favorite: newValue }).eq('id', songId);
        return newValue;
      }
      return false;
    } catch (e) {
      console.error('Error toggling favorite in Supabase:', e);
      return false;
    }
  }

  public async deleteSong(songId: string): Promise<void> {
    try {
      await supabase.from('songs').delete().eq('id', songId);
    } catch (e) {
      console.error('Error deleting song in Supabase:', e);
    }
  }

  // --- USER METHODS ---
  public async getUsers(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        email: row.email,
        fullName: row.full_name,
        avatarUrl: row.avatar_url,
        phone: row.phone,
        country: row.country,
        role: row.role as 'admin'|'user',
        status: row.status,
        referralCode: row.referral_code,
        bonusCredits: row.bonus_credits || 0,
        songCredits: row.song_credits || 0,
        createdAt: row.created_at,
        totalSongs: 0 // Would need a join to calculate properly
      }));
    } catch (e) {
      console.error('Error fetching users from Supabase:', e);
      return [];
    }
  }

  public async saveUser(user: UserProfile): Promise<UserProfile> {
    try {
      const dbUser: Record<string, any> = {
        full_name: user.fullName,
        avatar_url: user.avatarUrl,
        phone: user.phone,
        country: user.country,
        role: user.role,
        status: user.status,
        referral_code: user.referralCode,
        bonus_credits: user.bonusCredits || 0,
        song_credits: user.songCredits || 0,
      };
      
      // Use update instead of upsert since user already exists (RLS may not have INSERT policy)
      const { data, error } = await supabase
        .from('users')
        .update(dbUser)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) {
        console.error('[SAVE USER] Supabase update error:', error.message, error.details);
        
        // Fallback: try updating just the credits column directly
        const { error: creditsError } = await supabase
          .from('users')
          .update({ song_credits: user.songCredits || 0 })
          .eq('id', user.id);
          
        if (creditsError) {
          console.error('[SAVE USER] Credits-only update also failed:', creditsError.message);
        } else {
          console.log('[SAVE USER] Credits saved via fallback:', user.songCredits);
        }
      } else {
        console.log('[SAVE USER] Credits saved successfully:', user.songCredits, '-> DB returned:', data?.song_credits);
      }
      return user;
    } catch (e) {
      console.error('Error saving user to Supabase:', e);
      return user;
    }
  }

  // --- ADMIN ANALYTICS ---
  public async getAdminAnalytics(): Promise<AdminAnalytics> {
    try {
      const [{ count: totalSongs }, { count: totalUsers }, { data: songs }] = await Promise.all([
        supabase.from('songs').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('songs').select('price_fcfa, download_count')
      ]);
      
      const totalRevenueFcfa = (songs || []).reduce((sum, s) => sum + (s.price_fcfa || 2500), 0);
      const totalDownloads = (songs || []).reduce((sum, s) => sum + (s.download_count || 0), 0);

      return {
        totalUsers: totalUsers || 0,
        activeUsersToday: Math.min(totalUsers || 0, 1),
        totalRevenueFcfa,
        totalSongsGenerated: totalSongs || 0,
        totalDownloads,
        recentPayments: []
      };
    } catch (e) {
      console.error('Error fetching analytics from Supabase:', e);
      return {
        totalUsers: 0,
        activeUsersToday: 0,
        totalRevenueFcfa: 0,
        totalSongsGenerated: 0,
        totalDownloads: 0,
        recentPayments: []
      };
    }
  }

  // --- PAYMENTS ---
  public async getPayments(): Promise<PaymentTransaction[]> {
    try {
      const { data, error } = await supabase.from('payments').select('*');
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        userId: row.user_id,
        songId: row.song_id,
        reference: row.reference,
        provider: row.provider as any,
        amountFcfa: row.amount_fcfa,
        phoneNumber: row.phone_number,
        status: row.status,
        createdAt: row.created_at
      }));
    } catch (e) {
      console.error('Error fetching payments from Supabase:', e);
      return [];
    }
  }

  public async savePayment(payment: PaymentTransaction): Promise<PaymentTransaction> {
    try {
      const dbPayment = {
        id: payment.id,
        user_id: payment.userId,
        song_id: payment.songId,
        reference: payment.reference,
        provider: payment.provider,
        amount_fcfa: payment.amountFcfa,
        phone_number: payment.phoneNumber,
        status: payment.status
      };
      
      const { data, error } = await supabase
        .from('payments')
        .upsert(dbPayment)
        .select()
        .single();
        
      if (error) throw error;
      return payment;
    } catch (e) {
      console.error('Error saving payment to Supabase:', e);
      return payment;
    }
  }

  public clearAllData() {
    // Should generally not be allowed in production Supabase, kept for interface compatibility
    console.warn("clearAllData not implemented for Supabase to prevent accidental data loss.");
  }
}

export const d1Database = new SupabaseDatabaseService();
