import React, { useState } from 'react';
import { History, Download, Share2, Trash2, Edit3, Copy, RefreshCw, Play, Pause } from 'lucide-react';
import { Song } from '../../types/melodia';

interface HistoryPageProps {
  songs: Song[];
  onPlaySong: (song: Song) => void;
  onDeleteSong: (id: string) => void;
  onDuplicateSong: (song: Song) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  songs,
  onPlaySong,
  onDeleteSong,
  onDuplicateSong
}) => {
  return (
    <div>
      <h2 style={{ fontSize: 24, marginBottom: 4 }}>Historique des Créations & Paiements</h2>
      <p style={{ color: 'var(--ivory-dim)', fontSize: 14, marginBottom: 24 }}>
        Gérez, renommez, régénérez ou téléchargez l'ensemble de vos transactions et chansons générées.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {songs.map((song) => (
          <div key={song.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <img src={song.coverUrl} alt={song.title} style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {song.occasion} · {song.genre}
                  </div>
                  <h4 style={{ fontSize: 18 }}>{song.title}</h4>
                  <div style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>
                    Créé le {song.createdAt} · Réf: {song.id}
                  </div>
                </div>
              </div>

              <span style={{ background: 'rgba(255,107,91,0.15)', color: 'var(--coral)', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>
                2 500 FCFA (Moneroo)
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn-emerald" style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => onPlaySong(song)}>
                <Play size={14} /> Écouter
              </button>

              <button className="btn-glass" onClick={() => onDuplicateSong(song)}>
                <Copy size={14} /> Dupliquer / Régénérer
              </button>

              <button
                className="btn-glass"
                onClick={() => {
                  const text = encodeURIComponent(`🎶 Écoute la chanson IA créée pour ${song.recipientName} : ${song.title}`);
                  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                }}
              >
                <Share2 size={14} /> Partager WhatsApp
              </button>

              <button className="btn-glass" style={{ color: '#F43F5E' }} onClick={() => onDeleteSong(song.id)}>
                <Trash2 size={14} /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
