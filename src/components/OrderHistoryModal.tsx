import React, { useState } from 'react';
import { X, Play, Pause, Download, Share2, Music, Calendar, BookOpen, ImageIcon } from 'lucide-react';
import { Order } from '../types/melodia';
import { audioSynth } from '../utils/audioSynth';
import { getCoverArtForGenreAndOccasion, generateAILyrics } from '../services/aiGenerator';

interface OrderHistoryModalProps {
  orders: Order[];
  onClose: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ orders, onClose }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedLyricsId, setExpandedLyricsId] = useState<string | null>(null);

  const togglePlayOrder = (order: Order) => {
    if (playingId === order.id) {
      audioSynth.stop();
      setPlayingId(null);
    } else {
      setPlayingId(order.id);
      audioSynth.playTrack(
        order.genre,
        15,
        undefined,
        () => setPlayingId(null)
      );
    }
  };

  const handleShareWhatsApp = (order: Order) => {
    const text = encodeURIComponent(
      `🎶 Écoute la chanson personnalisée créée par Sonorya pour ${order.recipientName} pour son ${order.occasion} sur Sonorya par Technova !\n\nÉcouter la musique & voir la pochette : ${window.location.origin}/#order-${order.id}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = (order: Order) => {
    navigator.clipboard.writeText(`${window.location.origin}/#order-${order.id}`);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={() => { audioSynth.stop(); onClose(); }}>
      <div className="modal-content" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => { audioSynth.stop(); onClose(); }}>
          <X size={18} />
        </button>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>
            HISTORIQUE & BIBLIOTHÈQUE CLIENT
          </div>
          <h3 style={{ fontFamily: 'Fraunces', fontSize: 24 }}>
            Mes Chansons & Pochettes Sonorya ({orders.length})
          </h3>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ivory-dim)' }}>
            <Music size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p>Vous n'avez pas encore généré de chanson.</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Remplissez le formulaire sur la page d'accueil pour lancer la création  !</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {orders.map((order) => {
              const isPlaying = playingId === order.id;
              const coverUrl = order.coverUrl || getCoverArtForGenreAndOccasion(order.genre, order.occasion);
              const lyrics = order.fullLyrics || generateAILyrics(order.occasion, order.recipientName, order.story, order.genre);
              const showLyrics = expandedLyricsId === order.id;

              return (
                <div
                  key={order.id}
                  style={{
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 18,
                    padding: 18,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14
                  }}
                >
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    {/* Cover Image Thumbnail */}
                    <div style={{ width: 84, height: 84, borderRadius: 12, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                      <img src={coverUrl} alt={order.recipientName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700, textTransform: 'uppercase' }}>
                            {order.occasion} · {order.genre}
                          </div>
                          <h4 style={{ fontSize: 18, marginTop: 2 }}>Chanson pour {order.recipientName}</h4>
                          <div style={{ fontSize: 11.5, color: 'var(--ivory-dim)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                            <Calendar size={12} /> {order.createdAt} · Ref: {order.id}
                          </div>
                        </div>

                        <span style={{ background: 'rgba(47,217,196,0.15)', color: 'var(--teal)', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>
                          Payé ({order.paymentProvider})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      className="cta"
                      style={{ marginTop: 0, padding: '8px 14px', fontSize: 13, width: 'auto' }}
                      onClick={() => togglePlayOrder(order)}
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      {isPlaying ? 'Stop' : 'Écouter'}
                    </button>

                    <button
                      style={{
                        background: 'rgba(244,239,230,0.08)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--gold-light)',
                        borderRadius: 10,
                        padding: '8px 12px',
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                      onClick={() => setExpandedLyricsId(showLyrics ? null : order.id)}
                    >
                      <BookOpen size={14} /> {showLyrics ? 'Masquer paroles' : 'Paroles IA'}
                    </button>

                    <a
                      href={order.audioUrl || '#'}
                      download={`Sonorya-${order.recipientName}.mp3`}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Téléchargement du fichier MP3 HD de "${order.recipientName}" avec pochette HD incluses !`);
                      }}
                      style={{
                        background: 'rgba(244,239,230,0.08)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--ivory)',
                        borderRadius: 10,
                        padding: '8px 14px',
                        fontSize: 12.5,
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Download size={14} /> MP3 HD
                    </a>

                    <button
                      style={{
                        background: '#25D366',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        padding: '8px 14px',
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                      onClick={() => handleShareWhatsApp(order)}
                    >
                      <Share2 size={14} /> Partager WhatsApp
                    </button>
                  </div>

                  {showLyrics && (
                    <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: 14, fontSize: 12.5, color: 'var(--ivory-dim)', fontStyle: 'italic', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {lyrics}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
