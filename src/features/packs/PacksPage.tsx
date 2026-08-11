import React from 'react';
import { Package, Check, ArrowRight } from 'lucide-react';
import { Occasion, MusicalStyle } from '../../types/melodia';

interface PacksPageProps {
  onSelectPack: (occasion: Occasion, genre: MusicalStyle) => void;
}

export const PACKS_DATA = [
  { id: 'p-1', name: 'Pack BAC & Diplômes', badge: 'Populaire', cover: '/images/cover_bac_gospel.png', occasion: 'Réussite scolaire' as Occasion, genre: 'Gospel' as MusicalStyle, price: 2500, oldPrice: 4000, desc: 'Hymne de victoire avec mention du diplôme, de l\'école et conseils d\'avenir.' },
  { id: 'p-2', name: 'Pack Dot & Tradition', badge: 'Recommandé', cover: '/images/cover_dot_zouk.png', occasion: 'Dot' as Occasion, genre: 'Zouk' as MusicalStyle, price: 2500, oldPrice: 5000, desc: 'Célébration des deux familles, généalogie et bénédictions traditionnelles.' },
  { id: 'p-3', name: 'Pack Saint Valentin', badge: 'Coup de cœur', cover: '/images/cover_mariage_afrobeat.png', occasion: 'Demande en mariage' as Occasion, genre: 'RNB' as MusicalStyle, price: 2500, oldPrice: 4500, desc: 'Déclaration d\'amour envoûtante pour surprendre votre moitié en musique.' },
  { id: 'p-4', name: 'Pack Fête des Mères', badge: 'Émouvant', cover: '/images/cover_hommage_acoustique.png', occasion: 'Hommage' as Occasion, genre: 'Acoustique' as MusicalStyle, price: 2500, oldPrice: 4000, desc: 'Merci maman pour tous tes sacrifices, chanté sur une douce guitare.' },
  { id: 'p-5', name: 'Pack Noël & Nouvel An', badge: 'Festif', cover: '/images/cover_amapiano_party.png', occasion: 'Encouragement' as Occasion, genre: 'Afrobeat' as MusicalStyle, price: 2500, oldPrice: 4000, desc: 'Vœux de fin d\'année chaleureux pour toute la famille et la communauté.' },
  { id: 'p-6', name: 'Pack Ramadan & Aïd', badge: 'Spirituel', cover: '/images/cover_anniversaire_highlife.png', occasion: 'Remerciement' as Occasion, genre: 'Acoustique' as MusicalStyle, price: 2500, oldPrice: 4000, desc: 'Chanson de bénédiction et de partage spirituel pour les fêtes d\'Aïd.' }
];

export const PacksPage: React.FC<PacksPageProps> = ({ onSelectPack }) => {
  return (
    <div>
      <h2 style={{ fontSize: 24, marginBottom: 4 }}>Packs d'Occasions & Saisons</h2>
      <p style={{ color: 'var(--ivory-dim)', fontSize: 14, marginBottom: 24 }}>
        Découvrez nos configurations prêtes à l'emploi conçues pour les événements marquants de l'année.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {PACKS_DATA.map((pack) => (
          <div key={pack.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: 160, width: '100%', overflow: 'hidden' }}>
              <img 
                src={pack.cover} 
                alt={pack.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} 
              />
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(18,20,29,0.85)', backdropFilter: 'blur(8px)', color: 'var(--coral)', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 99, border: '1px solid rgba(255,107,91,0.3)' }}>
                {pack.badge}
              </div>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 19, marginBottom: 6, color: '#FFFFFF' }}>{pack.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--ivory-dim)', marginBottom: 16, lineHeight: 1.5 }}>{pack.desc}</p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--coral)' }}>{pack.price.toLocaleString()} FCFA</span>
                  <span style={{ fontSize: 13, color: 'var(--ivory-muted)', textDecoration: 'line-through' }}>{pack.oldPrice.toLocaleString()} FCFA</span>
                </div>
              </div>

              <button className="btn-emerald" style={{ justifyContent: 'center', width: '100%', marginTop: 8 }} onClick={() => onSelectPack(pack.occasion, pack.genre)}>
                Choisir ce Pack <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
