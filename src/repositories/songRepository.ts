import { Song, Occasion, MusicalStyle } from '../types/melodia';
import { d1Database } from '../services/d1Service';

export const INITIAL_SONGS: Song[] = [];

export class SongRepository {
  private songs: Song[] = [];

  constructor() {
    this.refresh();
  }

  public async refresh() {
    this.songs = await d1Database.getSongs();
  }

  private save() {
    try {
      localStorage.setItem('melodia_songs_repo', JSON.stringify(this.songs));
    } catch (e) {
      // ignore
    }
  }

  public getAll(): Song[] {
    const unique: Song[] = [];
    const seenIds = new Set<string>();
    const seenTitles = new Set<string>();

    for (const song of this.songs) {
      const titleKey = song.title ? song.title.toLowerCase().trim() : '';
      if (!seenIds.has(song.id) && (!titleKey || !seenTitles.has(titleKey))) {
        seenIds.add(song.id);
        if (titleKey) seenTitles.add(titleKey);
        unique.push(song);
      }
    }
    return unique;
  }

  public getById(id: string): Song | undefined {
    return this.songs.find(s => s.id === id);
  }

  public getFavorites(): Song[] {
    return this.getAll().filter(s => s.isFavorite);
  }

  public add(song: Song): Song {
    const existingIndex = this.songs.findIndex(s => s.id === song.id || (s.title && song.title && s.title.toLowerCase().trim() === song.title.toLowerCase().trim()));
    if (existingIndex >= 0) {
      this.songs[existingIndex] = { ...this.songs[existingIndex], ...song };
    } else {
      this.songs = [song, ...this.songs];
    }
    this.save();
    d1Database.saveSong(song);
    return song;
  }

  public toggleFavorite(id: string): boolean {
    const song = this.songs.find(s => s.id === id);
    if (song) {
      song.isFavorite = !song.isFavorite;
      this.save();
      d1Database.toggleFavorite(id);
      return song.isFavorite;
    }
    return false;
  }

  public delete(id: string): void {
    this.songs = this.songs.filter(s => s.id !== id);
    this.save();
    d1Database.deleteSong(id);
  }

  public search(query: string, occasionFilter?: string, genreFilter?: string): Song[] {
    return this.songs.filter(s => {
      const matchQuery = !query || (s.title || '').toLowerCase().includes(query.toLowerCase()) || s.recipientName.toLowerCase().includes(query.toLowerCase()) || s.story.toLowerCase().includes(query.toLowerCase());
      const matchOccasion = !occasionFilter || s.occasion === occasionFilter;
      const matchGenre = !genreFilter || s.genre === genreFilter;
      return matchQuery && matchOccasion && matchGenre;
    });
  }
}

export const songRepository = new SongRepository();
