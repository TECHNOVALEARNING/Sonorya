import React, { useState } from 'react';
import { Play, Pause, Heart, Download, Share2, Search, Filter } from 'lucide-react';
import { Song } from '../../types/melodia';

interface LibraryPageProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  songs,
  currentSong,
  isPlaying,
  onPlaySong,
  onToggleFavorite
}) => {
  const [tab, setTab] = useState<'all' | 'creations' | 'favorites' | 'downloaded'>('all');
  const [filterGenre, setFilterGenre] = useState<string>('all');

  const filteredSongs = songs.filter((s) => {
    if (tab === 'favorites' && !s.isFavorite) return false;
    if (tab === 'downloaded' && !s.isDownloaded) return false;
    if (filterGenre !== 'all' && s.genre !== filterGenre) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24 }}>Votre Bibliothèque Musicale</h2>
          <p style={{ color: 'var(--ivory-dim)', fontSize: 14 }}>
            Retrouvez l'ensemble de vos morceaux créés, favoris et téléchargés.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--glass-border)', paddingBottom: 12 }}>
        {(['all', 'creations', 'favorites', 'downloaded'] as const).map((t) => (
          <button
            key={t}
            className={tab === t ? 'btn-emerald' : 'btn-glass'}
            style={{ padding: '8px 16px', fontSize: 13 }}
            onClick={() => setTab(t)}
          >
            {t === 'all' && 'Toutes les chansons'}
            {t === 'creations' && 'Mes créations'}
            {t === 'favorites' && 'Favoris'}
            {t === 'downloaded' && 'Téléchargées'}
          </button>
        ))}
      </div>

      {/* Song List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredSongs.map((song) => {
          const isSelected = currentSong?.id === song.id;
          const isPlayingThis = isSelected && isPlaying;

          return (
            <div
              key={song.id}
              className="glass-card"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 50, height: 50, borderRadius: 10, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                  <img src={song.coverUrl} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div>
                  <div style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {song.occasion} · {song.genre}
                  </div>
                  <h4 style={{ fontSize: 16 }}>{song.title}</h4>
                  <div style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>Pour {song.recipientName}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  style={{ background: 'none', border: 'none', color: song.isFavorite ? 'var(--coral)' : 'var(--ivory-muted)', cursor: 'pointer' }}
                  onClick={() => onToggleFavorite(song.id)}
                >
                  <Heart size={18} fill={song.isFavorite ? 'var(--coral)' : 'none'} />
                </button>

                <button className="btn-emerald" style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => onPlaySong(song)}>
                  {isPlayingThis ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}
                  {isPlayingThis ? 'Pause' : 'Écouter'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
