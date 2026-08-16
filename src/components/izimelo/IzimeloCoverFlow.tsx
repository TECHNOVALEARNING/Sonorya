import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Disc } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

export interface CoverFlowItem {
  id: string;
  title: string;
  genre: string;
  duration: string;
  coverUrl: string;
  audioSampleUrl: string;
}

export const COVERFLOW_ITEMS: CoverFlowItem[] = [
  {
    id: 'cf-1',
    title: 'Travaille dans le silence',
    genre: 'Style Afrobeat Motivant',
    duration: '2:55',
    coverUrl: 'https://i.pinimg.com/736x/7a/91/65/7a916572aac266f2e224d5c547ce8ce5.jpg',
    audioSampleUrl: '/audios/encouragement.mp3'
  },
  {
    id: 'cf-2',
    title: 'Joyeux Anniversaire Sarah',
    genre: 'Style Ivoirien / Amapiano',
    duration: '2:34',
    coverUrl: '/images/cover_amapiano_party.png',
    audioSampleUrl: '/audios/Annif.mp3'
  },
  {
    id: 'cf-3',
    title: 'Pour mon épouse Christelle',
    genre: 'Style Afrobeat',
    duration: '3:12',
    coverUrl: '/images/cover_mariage_afrobeat.png',
    audioSampleUrl: '/audios/marriage.mp3'
  },
  {
    id: 'cf-4',
    title: 'Hommage à Grand-Père',
    genre: 'Style Acoustique',
    duration: '2:48',
    coverUrl: '/images/cover_hommage_acoustique.png',
    audioSampleUrl: '/audios/grand pere.mp3'
  },
  {
    id: 'cf-5',
    title: 'Félicitations pour le BAC',
    genre: 'Style Gospel / Amapiano',
    duration: '4:01',
    coverUrl: '/images/cover_bac_gospel.png',
    audioSampleUrl: '/audios/bac.mp3'
  },
  {
    id: 'cf-6',
    title: 'Il faut avoir l\'argent',
    genre: 'Style Highlife / Zouglou',
    duration: '3:25',
    coverUrl: 'https://i.pinimg.com/736x/f3/ee/93/f3ee93e52da8c5cd117aa22d2c52b8c8.jpg',
    audioSampleUrl: '/audios/argent.mp3'
  },
  {
    id: 'cf-7',
    title: 'La discipline est la clé de la réussite',
    genre: 'Style R&B Afro',
    duration: '3:05',
    coverUrl: 'https://i.pinimg.com/736x/6a/84/e8/6a84e8f93cdee9aeeca9c1cfbc694763.jpg',
    audioSampleUrl: '/audios/La discipline.mp3'
  },
  {
    id: 'cf-8',
    title: 'Entre deux mondes',
    genre: 'Style Gospel Mbalax',
    duration: '3:40',
    coverUrl: 'https://i.pinimg.com/736x/d2/38/28/d23828480c561e53b1e40f0d5de6c8e5.jpg',
    audioSampleUrl: '/audios/Entre deux mondes.mp3'
  },
  {
    id: 'cf-9',
    title: 'Elle me manque',
    genre: 'Style Zouk Romantique',
    duration: '2:55',
    coverUrl: 'https://i.pinimg.com/736x/26/ba/40/26ba40d811dd3538cb71526f2cccc0f3.jpg',
    audioSampleUrl: '/audios/elle me manque.mp3'
  },
  {
    id: 'cf-10',
    title: 'Soirée Amapiano Club',
    genre: 'Style Amapiano Beats',
    duration: '3:30',
    coverUrl: '/images/cover_amapiano_club.png',
    audioSampleUrl: '/audios/Annif.mp3'
  }
];

export const IzimeloCoverFlow: React.FC = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScroll || isPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % COVERFLOW_ITEMS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isAutoScroll, isPlaying]);

  // Audio play/pause handler
  const handleTogglePlay = (index: number) => {
    const item = COVERFLOW_ITEMS[index];
    
    if (activeIndex === index && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      setActiveIndex(index);
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = item.audioSampleUrl;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);

      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const handlePrev = () => {
    setIsAutoScroll(false);
    setActiveIndex((prev) => (prev - 1 + COVERFLOW_ITEMS.length) % COVERFLOW_ITEMS.length);
  };

  const handleNext = () => {
    setIsAutoScroll(false);
    setActiveIndex((prev) => (prev + 1) % COVERFLOW_ITEMS.length);
  };

  const activeTrack = COVERFLOW_ITEMS[activeIndex];

  return (
    <section className="coverflow-section" id="library" style={{ padding: '80px 0 90px', position: 'relative', overflow: 'hidden' }}>
      <div className="wrap" style={{ textAlign: 'center' }}>
        {/* Section Header */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, background: 'rgba(45, 212, 191, 0.12)', border: '1px solid rgba(45, 212, 191, 0.25)', color: 'var(--gold)', fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
          <Disc size={16} className="spin-slow" />
          <span>{t('coverflow.badge')}</span>
        </div>

        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.02em' }}>
          {t('coverflow.title')} <span style={{ color: 'var(--coral)', background: 'linear-gradient(135deg, var(--coral), var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('coverflow.titleHighlight')}</span>
        </h2>
        <p style={{ color: 'var(--ivory-dim)', fontSize: 15, maxWidth: 620, margin: '0 auto 50px' }}>
          {t('coverflow.subtitle')}
        </p>

        {/* 3D Cover Flow Display Stage */}
        <div 
          className="coverflow-stage"
          onMouseEnter={() => setIsAutoScroll(false)}
          onMouseLeave={() => !isPlaying && setIsAutoScroll(true)}
        >
          <div className="coverflow-track">
            {COVERFLOW_ITEMS.map((item, index) => {
              let offset = index - activeIndex;
              const total = COVERFLOW_ITEMS.length;

              if (offset > Math.floor(total / 2)) offset -= total;
              if (offset < -Math.floor(total / 2)) offset += total;

              const absOffset = Math.abs(offset);
              const isActive = offset === 0;

              const rotateY = offset === 0 ? 0 : offset < 0 ? 42 : -42;
              const translateX = offset * 140;
              const translateZ = isActive ? 120 : -140 * absOffset;
              const scale = isActive ? 1.15 : Math.max(0.7, 1 - absOffset * 0.15);
              const opacity = absOffset > 3 ? 0 : Math.max(0.2, 1 - absOffset * 0.25);
              const zIndex = 100 - absOffset;

              return (
                <div
                  key={item.id}
                  className={`coverflow-card ${isActive ? 'active' : ''}`}
                  style={{
                    transform: `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    pointerEvents: absOffset > 3 ? 'none' : 'auto'
                  }}
                  onClick={() => handleTogglePlay(index)}
                >
                  <img src={item.coverUrl} alt={item.title} className="coverflow-card-img" />
                  
                  <div className="coverflow-card-overlay">
                    <div className="coverflow-play-btn">
                      {isActive && isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: 3 }} />}
                    </div>
                    <div className="coverflow-card-info">
                      <div className="coverflow-card-title">{item.title}</div>
                      <div className="coverflow-card-sub">{item.genre}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls & Active Track Details */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 40 }}>
          <button 
            className="coverflow-nav-btn" 
            onClick={handlePrev}
            aria-label="Précédent"
          >
            <ChevronLeft size={22} />
          </button>

          <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px 24px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ivory)' }}>
              {`${activeIndex + 1} / ${COVERFLOW_ITEMS.length} — ${activeTrack.title}`}
            </span>
            <button 
              onClick={() => handleTogglePlay(activeIndex)}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: isPlaying ? 'var(--coral)' : 'rgba(255,255,255,0.15)',
                border: 'none',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} style={{ marginLeft: 2 }} />}
            </button>
          </div>

          <button 
            className="coverflow-nav-btn" 
            onClick={handleNext}
            aria-label="Suivant"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};
