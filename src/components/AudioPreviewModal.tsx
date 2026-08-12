import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Sparkles, ShieldCheck, Music2, Image as ImageIcon } from 'lucide-react';
import { Order } from '../types/melodia';
import { audioSynth } from '../utils/audioSynth';
import { generateAILyrics, getCoverArtForGenreAndOccasion } from '../services/aiGenerator';

interface AudioPreviewModalProps {
  orderDraft: Partial<Order>;
  onClose: () => void;
  onProceedToPayment: () => void;
}

export const AudioPreviewModal: React.FC<AudioPreviewModalProps> = ({
  orderDraft,
  onClose,
  onProceedToPayment,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const occasion = orderDraft.occasion || 'Anniversaire';
  const recipientName = orderDraft.recipientName || 'votre proche';
  const story = orderDraft.story || '';
  const genre = orderDraft.genre || 'Afrobeat';

  const lyrics = generateAILyrics(occasion, recipientName, story, genre);
  const coverUrl = getCoverArtForGenreAndOccasion(genre, occasion);

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioSynth.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      audioSynth.playTrack(
        genre,
        14,
        (pct) => setProgress(pct),
        () => setIsPlaying(false)
      );
    }
  };

  useEffect(() => {
    return () => {
      audioSynth.stop();
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={() => { audioSynth.stop(); onClose(); }}>
      <div className="modal-content" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => { audioSynth.stop(); onClose(); }}>
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(47,217,196,0.15)', color: 'var(--teal)', padding: '4px 12px', borderRadius: 99, fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>
            <img src="/images/sonorya-app-logo.png" alt="Sonorya" style={{ width: 14, height: 14, borderRadius: 3, objectFit: 'cover' }} /> Musique & Pochette Générées par l'IA
          </div>
          <h3 style={{ fontFamily: 'Fraunces', fontSize: 24, marginBottom: 4 }}>
            Extrait IA pour "{recipientName}"
          </h3>
          <p style={{ color: 'var(--ivory-dim)', fontSize: 13.5 }}>
            Occasion : <strong>{occasion}</strong> · Style : <strong>{genre}</strong>
          </p>
        </div>

        {/* AI Album Artwork Display */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: 14, marginBottom: 18 }}>
          <div style={{ width: 110, height: 110, borderRadius: 12, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
            <img src={coverUrl} alt="Pochette IA" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.7)', color: 'var(--gold-light)', padding: '2px 6px', borderRadius: 4, fontSize: 9.5, fontWeight: 700 }}>
              Pochette 
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ivory)', marginBottom: 8 }}>
              Arrangement musical {genre}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <button className="play-btn" style={{ width: 42, height: 42, fontSize: 16 }} onClick={handleTogglePlay}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, color: 'var(--ivory-dim)', marginBottom: 4 }}>
                  {isPlaying ? 'Lecture de la démo IA...' : 'Cliquez pour lancer l\'extrait'}
                </div>
                <div style={{ height: 6, background: 'rgba(244,239,230,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--gold), var(--coral))', transition: 'width 0.1s linear' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Paroles Snippet */}
        <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: 16, marginBottom: 20, maxHeight: 180, overflowY: 'auto' }}>
          <div style={{ fontSize: 11.5, color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Music2 size={14} /> Paroles Intégrales Écrites par Sonorya
          </div>
          <pre style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--ivory)', whiteSpace: 'pre-wrap', lineHeight: 1.55, fontStyle: 'italic' }}>
            {lyrics}
          </pre>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="cta" style={{ flex: 1 }} onClick={() => { audioSynth.stop(); onProceedToPayment(); }}>
            <ShieldCheck size={18} />
            Débloquer le Morceau MP3 & la Pochette HD (2 500 FCFA)
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--ivory-dim)', marginTop: 12 }}>
          Paiement rapide et sécurisé (MTN MoMo, Wave, Orange, Moov, Carte)
        </p>
      </div>
    </div>
  );
};
