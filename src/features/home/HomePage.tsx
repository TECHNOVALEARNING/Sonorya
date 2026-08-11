import React from 'react';
import { PlusCircle, Music, Heart, History, Download, Sparkles, Play, Pause } from 'lucide-react';
import { Occasion, MusicalStyle, Song } from '../../types/melodia';
import { useTranslation } from '../../i18n/LanguageContext';
import { fr } from '../../i18n/translations/fr';
import { en } from '../../i18n/translations/en';

interface HomePageProps {
  onOpenWizard: (occasion?: Occasion, genre?: MusicalStyle) => void;
  onSelectTab: (tab: any) => void;
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
}

export const CATEGORIES: { name: Occasion; desc: string; cover: string }[] = [
  { name: 'Anniversaire', desc: 'Célébrez une année de plus en musique', cover: 'https://i.pinimg.com/736x/a4/bc/36/a4bc36b605e594a0fe17348de76e7024.jpg' },
  { name: 'Mariage', desc: 'Entrée des mariés & hymnes d\'union', cover: 'https://i.pinimg.com/736x/69/af/32/69af32c0ae5757149aa03e8b83df2200.jpg' },
  { name: 'Demande en mariage', desc: 'Déclaration enflammée romantique', cover: 'https://i.pinimg.com/736x/2e/d2/c2/2ed2c250da318137cdd6647c84921cdb.jpg' },
  { name: 'Baptême', desc: 'Bénédiction douce et solennelle', cover: 'https://i.pinimg.com/736x/57/0d/f7/570df7ef2f98e9ce752db33b44644f3b.jpg' },
  { name: 'Dot', desc: 'Récit des origines et tradition', cover: 'https://i.pinimg.com/736x/4e/5c/75/4e5c756ae2cbd4675e55934424981e14.jpg' },
  { name: 'Réussite scolaire', desc: 'Félicitations pour le BAC & diplômes', cover: 'https://i.pinimg.com/736x/85/14/4b/85144b030ab21d6dc8399f97fdb5edaa.jpg' },
  { name: 'Réussite professionnelle', desc: 'Promotion, nouveau job & succès', cover: 'https://i.pinimg.com/736x/9d/60/fe/9d60fe2f830f535de6289b2229b96b26.jpg' },
  { name: 'Hommage', desc: 'Mélodie du souvenir et de l\'amour', cover: 'https://i.pinimg.com/736x/0f/25/e9/0f25e9321fd17035e2986807a68fed06.jpg' },
  { name: 'Encouragement', desc: 'Force, courage et persévérance', cover: 'https://i.pinimg.com/736x/45/40/07/454007166319e6979bd38fdb94c62378.jpg' },
  { name: 'Remerciement', desc: 'Dire merci avec émotion', cover: 'https://i.pinimg.com/1200x/a4/d6/40/a4d640f223985173a09b40e5f3f020f8.jpg' },
  { name: 'Excuses', desc: 'Demande de pardon en chanson', cover: 'https://i.pinimg.com/736x/1f/28/41/1f284110c3700982b38584831615b477.jpg' },
  { name: 'Fun', desc: 'Ambiance festive & plaisanteries', cover: 'https://i.pinimg.com/1200x/7d/f7/17/7df717850bc0ed1138d21d9baebfcc70.jpg' },
  { name: 'Autre', desc: 'Événement personnalisé sur-mesure', cover: 'https://i.pinimg.com/736x/a3/5d/93/a35d93c29afa464114927685201b9446.jpg' },
];

export const MUSICAL_STYLES: MusicalStyle[] = [
  'Afrobeat', 'Amapiano', 'Zouk', 'Coupé-Décalé', 'Highlife', 'Mbalax',
  'Gospel', 'RnB', 'Rap', 'Drill', 'Trap', 'Acoustique',
  'Pop', 'Soul', 'Reggae', 'Jazz', 'Classique', 'Traditionnel'
];

export const HomePage: React.FC<HomePageProps> = ({
  onOpenWizard,
  onSelectTab,
  songs,
  currentSong,
  isPlaying,
  onPlaySong
}) => {
  const { t, lang } = useTranslation();
  const catsBase = lang === 'FR' ? fr.categories : en.categories;

  return (
    <div>
      {/* Quick Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 36 }}>
        <div
          className="glass-card"
          style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(255,107,91,0.2), rgba(19,26,38,0.8))', borderColor: 'var(--coral)' }}
          onClick={() => onOpenWizard()}
        >
          <PlusCircle size={24} className="text-coral" style={{ marginBottom: 10 }} />
          <div style={{ fontWeight: 700, fontSize: 15 }}>{t('home.createSong')}</div>
          <div style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>{t('home.createSongDesc')}</div>
        </div>

        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => onSelectTab('library')}>
          <Music size={24} style={{ color: '#38BDF8', marginBottom: 10 }} />
          <div style={{ fontWeight: 700, fontSize: 15 }}>{t('home.mySongs')}</div>
          <div style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>{songs.length} {t('home.mySongsDesc')}</div>
        </div>

        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => onSelectTab('library')}>
          <Heart size={24} style={{ color: '#F43F5E', marginBottom: 10 }} />
          <div style={{ fontWeight: 700, fontSize: 15 }}>{t('home.favorites')}</div>
          <div style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>{t('home.favoritesDesc')}</div>
        </div>

        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => onSelectTab('history')}>
          <History size={24} style={{ color: '#F59E0B', marginBottom: 10 }} />
          <div style={{ fontWeight: 700, fontSize: 15 }}>{t('home.history')}</div>
          <div style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>{t('home.historyDesc')}</div>
        </div>
      </div>

      {/* Categories Section */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, marginBottom: 4 }}>{t('home.categoriesTitle')}</h2>
        <p style={{ color: 'var(--ivory-dim)', fontSize: 14, marginBottom: 16 }}>
          {t('home.categoriesDesc')}
        </p>

        <div className="category-grid">
          {CATEGORIES.map((cat) => {
            const translatedCat = catsBase[cat.name as keyof typeof catsBase] || cat;
            return (
              <div key={cat.name} className="category-card" onClick={() => onOpenWizard(cat.name)}>
                <img src={cat.cover} alt={cat.name} className="cat-img" />
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{translatedCat.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ivory-muted)' }}>{translatedCat.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 18 Musical Styles */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, marginBottom: 4 }}>{t('home.stylesTitle')}</h2>
        <p style={{ color: 'var(--ivory-dim)', fontSize: 14, marginBottom: 16 }}>
          {t('home.stylesDesc')}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {MUSICAL_STYLES.map((style) => (
            <button
              key={style}
              className="btn-glass"
              style={{ padding: '8px 14px', fontSize: 13 }}
              onClick={() => onOpenWizard(undefined, style)}
            >
              <Sparkles size={14} className="text-coral" />
              {style}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Songs Section */}
      <section>
        <h2 style={{ fontSize: 22, marginBottom: 16 }}>{t('home.trendingTitle')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
          {songs.map((song) => {
            const isSelected = currentSong?.id === song.id;
            const isPlayingThis = isSelected && isPlaying;

            return (
              <div key={song.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ width: '100%', height: 140, borderRadius: 12, overflow: 'hidden', marginBottom: 12, position: 'relative' }}>
                    <img src={song.coverUrl} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'var(--coral)',
                        border: 'none',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                      }}
                      onClick={() => onPlaySong(song)}
                    >
                      {isPlayingThis ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
                    </button>
                  </div>

                  <div style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {catsBase[song.occasion as keyof typeof catsBase]?.name || song.occasion} · {song.genre}
                  </div>
                  <h4 style={{ fontSize: 16, marginTop: 2, marginBottom: 4 }}>{song.title}</h4>
                  <div style={{ fontSize: 12.5, color: 'var(--ivory-dim)' }}>{t('home.for')} {song.recipientName}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
