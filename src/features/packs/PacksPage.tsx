import React from 'react';
import { Package, Check, ArrowRight } from 'lucide-react';
import { Occasion, MusicalStyle } from '../../types/melodia';

interface PacksPageProps {
  onSelectPack: (occasion: Occasion, genre: MusicalStyle) => void;
}

export const PRICING_PLANS = [
  {
    id: 'single',
    name: 'Chanson Unique',
    badge: 'Découverte',
    songsCount: 1,
    price: 1999,
    oldPrice: 3500,
    unitPrice: '1 999 FCFA / musique',
    features: ['1 Chanson personnalisée', 'Téléchargement MP3 HD', 'Pochette & Paroles sur-mesure', 'Livraison rapide en ~2 min'],
    isPopular: false
  },
  {
    id: 'trio',
    name: 'Pack 3 Musiques',
    badge: '⭐ Le Plus Populaire',
    songsCount: 3,
    price: 2999,
    oldPrice: 6000,
    unitPrice: '1 000 FCFA / musique',
    features: ['3 Musiques créées (1 immédiate + 2 crédits)', 'Crédits valables à vie sur votre compte', 'Idéal pour fêtes et anniversaires', 'Économie massive de 50%'],
    isPopular: true
  },
  {
    id: 'prestige',
    name: 'Pack 8 Musiques',
    badge: '🔥 Meilleure Offre',
    songsCount: 8,
    price: 7999,
    oldPrice: 16000,
    unitPrice: '1 000 FCFA / musique',
    features: ['8 Musiques créées (1 immédiate + 7 crédits)', 'Idéal pour grands événements & familles', 'Support prioritaire & téléchargements HD', 'Économie maximale'],
    isPopular: false
  }
];

export const PACKS_DATA = [
  { id: 'p-1', name: 'Pack BAC & Diplômes', badge: 'Populaire', cover: '/images/cover_bac_gospel.png', occasion: 'Réussite scolaire' as Occasion, genre: 'Gospel' as MusicalStyle, price: 1999, oldPrice: 3500, desc: 'Hymne de victoire avec mention du diplôme, de l\'école et conseils d\'avenir.' },
  { id: 'p-2', name: 'Pack Dot & Tradition', badge: 'Recommandé', cover: '/images/cover_dot_zouk.png', occasion: 'Dot' as Occasion, genre: 'Zouk' as MusicalStyle, price: 1999, oldPrice: 4000, desc: 'Célébration des deux familles, généalogie et bénédictions traditionnelles.' },
  { id: 'p-3', name: 'Pack Saint Valentin', badge: 'Coup de cœur', cover: '/images/cover_mariage_afrobeat.png', occasion: 'Demande en mariage' as Occasion, genre: 'RNB' as MusicalStyle, price: 1999, oldPrice: 3500, desc: 'Déclaration d\'amour envoûtante pour surprendre votre moitié en musique.' },
  { id: 'p-4', name: 'Pack Fête des Mères', badge: 'Émouvant', cover: '/images/cover_hommage_acoustique.png', occasion: 'Hommage' as Occasion, genre: 'Acoustique' as MusicalStyle, price: 1999, oldPrice: 3500, desc: 'Merci maman pour tous tes sacrifices, chanté sur une douce guitare.' },
  { id: 'p-5', name: 'Pack Noël & Nouvel An', badge: 'Festif', cover: '/images/cover_amapiano_party.png', occasion: 'Encouragement' as Occasion, genre: 'Afrobeat' as MusicalStyle, price: 1999, oldPrice: 3500, desc: 'Vœux de fin d\'année chaleureux pour toute la famille et la communauté.' },
  { id: 'p-6', name: 'Pack Ramadan & Aïd', badge: 'Spirituel', cover: '/images/cover_anniversaire_highlife.png', occasion: 'Remerciement' as Occasion, genre: 'Acoustique' as MusicalStyle, price: 1999, oldPrice: 3500, desc: 'Chanson de bénédiction et de partage spirituel pour les fêtes d\'Aïd.' }
];

export const PacksPage: React.FC<PacksPageProps> = ({ onSelectPack }) => {
  return (
    <div>
      {/* Tarifs & Offres de Crédits */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, color: '#FFFFFF' }}>Tarifs & Packs de Création</h2>
        <p style={{ color: 'var(--ivory-dim)', fontSize: 14, marginBottom: 24 }}>
          Choisissez la formule qui vous convient. Les crédits inutilisés sont conservés sur votre compte pour vos prochaines créations !
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 20 }}>
          {PRICING_PLANS.map((plan) => (
            <div 
              key={plan.id}
              style={{
                background: plan.isPopular ? 'rgba(45, 212, 191, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: plan.isPopular ? '2px solid #2DD4BF' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 20,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: plan.isPopular ? '0 10px 30px rgba(45, 212, 191, 0.15)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>{plan.name}</h3>
                  <span style={{ fontSize: 11, fontWeight: 800, background: plan.isPopular ? '#2DD4BF' : 'rgba(255,255,255,0.1)', color: plan.isPopular ? '#0F172A' : 'var(--gold)', padding: '4px 10px', borderRadius: 99 }}>
                    {plan.badge}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: plan.isPopular ? '#2DD4BF' : '#FFFFFF' }}>{plan.price.toLocaleString()} FCFA</span>
                  <span style={{ fontSize: 14, color: 'var(--ivory-muted)', textDecoration: 'line-through' }}>{plan.oldPrice.toLocaleString()} FCFA</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700, marginBottom: 16 }}>{plan.unitPrice}</div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', fontSize: 13, color: 'var(--ivory-dim)', lineHeight: 1.8 }}>
                  {plan.features.map((feat, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Check size={14} style={{ color: '#2DD4BF', flexShrink: 0 }} /> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className={plan.isPopular ? 'btn-coral' : 'btn-emerald'} 
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }} 
                onClick={() => onSelectPack('Anniversaire', 'Amapiano')}
              >
                Créer maintenant <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Configurations prêtes à l'emploi */}
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color: '#FFFFFF' }}>Packs d'Occasions & Saisons</h3>
      <p style={{ color: 'var(--ivory-dim)', fontSize: 14, marginBottom: 20 }}>
        Découvrez nos configurations de styles et thèmes prêts à l'emploi.
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
