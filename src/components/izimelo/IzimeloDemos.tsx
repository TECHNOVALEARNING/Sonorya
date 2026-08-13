import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { audioSynth } from '../../utils/audioSynth';
import { useTranslation } from '../../i18n/LanguageContext';
import { fr } from '../../i18n/translations/fr';
import { en } from '../../i18n/translations/en';

interface DemoItem {
  id: string;
  title: string;
  genre: string;
  duration: string;
  tags: string[];
  coverUrl: string;
  audioSampleUrl?: string;
}

export const IZIMELO_DEMOS: DemoItem[] = [
  {
    id: 'izi-1',
    title: 'Joyeux Anniversaire Sarah',
    genre: 'Style Ivoirien / Amapiano',
    duration: '2:34',
    tags: ['ANNIVERSAIRE', 'FÊTE'],
    coverUrl: 'https://i.pinimg.com/736x/32/8b/9c/328b9c386dc379d5f9e7758ad57c5b92.jpg',
    audioSampleUrl: '/audios/Annif.mp3'
  },
  {
    id: 'izi-2',
    title: 'Pour mon épouse Christelle',
    genre: 'Style Afrobeat',
    duration: '3:12',
    tags: ['AMOUR', 'ROMANCE'],
    coverUrl: 'https://i.pinimg.com/1200x/1b/36/3b/1b363b159ec63f8fc7b3ea6beca87237.jpg',
    audioSampleUrl: '/audios/marriage.mp3'
  },
  {
    id: 'izi-3',
    title: 'Hommage à Grand-Père',
    genre: 'Style Acoustique',
    duration: '2:48',
    tags: ['HOMMAGE', 'MÉMOIRE'],
    coverUrl: 'https://i.pinimg.com/1200x/a9/27/a2/a927a262fd995a387aecba7696757efb.jpg',
    audioSampleUrl: '/audios/grand pere.mp3'
  },
  {
    id: 'izi-4',
    title: 'Félicitations pour le BAC',
    genre: 'Style Gospel / Amapiano',
    duration: '4:01',
    tags: ['DIPLÔME', 'RÉUSSITE'],
    coverUrl: '/images/cover_bac_gospel.png',
    audioSampleUrl: '/audios/bac.mp3'
  },
  {
    id: 'izi-5',
    title: 'Travaille dans le silence',
    genre: 'Style Afrobeat Motivant',
    duration: '2:55',
    tags: ['ENCOURAGEMENT', 'FORCE'],
    coverUrl: 'https://i.pinimg.com/736x/7a/91/65/7a916572aac266f2e224d5c547ce8ce5.jpg',
    audioSampleUrl: '/audios/encouragement.mp3'
  }
];

const SPECTRUM_BASE_HEIGHTS = [
  22, 28, 45, 32, 55, 80, 95, 65, 48, 85, 100, 72, 88, 92, 68, 58, 42, 65, 32, 28, 48, 38, 22, 18
];

const demoStyles = `
  @keyframes demoWaveBounce {
    0% { transform: scaleY(0.2); }
    50% { transform: scaleY(1); }
    100% { transform: scaleY(0.25); }
  }

  .spectrum-bar {
    width: 3px;
    border-radius: 3px;
    background: #ffffff;
    transform-origin: bottom;
    opacity: 0.85;
    transition: opacity 0.3s ease;
  }

  .spectrum-bar.playing {
    opacity: 1;
    animation: demoWaveBounce 1.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate;
  }

  .izimelo-demos-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
  }

  @media (max-width: 1024px) {
    .izimelo-demos-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 640px) {
    .izimelo-demos-grid {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  .demo-card-container {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    height: 220px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }

  .demo-card-container:hover {
    transform: translateY(-4px);
    border-color: rgba(45, 212, 191, 0.5);
    box-shadow: 0 14px 32px -6px rgba(0, 0, 0, 0.6);
  }

  .demo-card-bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  .demo-card-container:hover .demo-card-bg {
    transform: scale(1.04);
  }

  .demo-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(10, 5, 20, 0.45) 45%, rgba(10, 5, 20, 0.94) 100%);
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 2;
  }

  .demo-play-center {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.35);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    margin-top: auto;
    margin-bottom: auto;
    opacity: 0;
    transform: scale(0.85);
    transition: opacity 0.25s ease, transform 0.25s ease, background 0.25s ease;
  }

  .demo-card-container:hover .demo-play-center,
  .demo-card-container.playing .demo-play-center {
    opacity: 1;
    transform: scale(1);
  }

  .demo-card-container.playing .demo-play-center {
    background: var(--coral);
    border-color: var(--coral);
  }
`;

export const IzimeloDemos: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t, lang } = useTranslation();
  const tBase = lang === 'FR' ? fr.demos : en.demos;

  const togglePlay = (demo: DemoItem) => {
    if (activeId === demo.id) {
      if (demo.audioSampleUrl && audioRef.current) {
        audioRef.current.pause();
      } else {
        audioSynth.stop();
      }
      setActiveId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioSynth.stop();

      setActiveId(demo.id);

      if (demo.audioSampleUrl) {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = demo.audioSampleUrl;
        audioRef.current.play().catch(console.error);

        audioRef.current.onended = () => {
          setActiveId(null);
        };
      } else {
        audioSynth.playTrack(
          demo.genre,
          15,
          undefined,
          () => setActiveId(null)
        );
      }
    }
  };

  useEffect(() => {
    return () => {
      audioSynth.stop();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <section className="wrap" id="examples" style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
      <style>{demoStyles}</style>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--coral)', margin: '0 auto 14px' }} />

      <h2 style={{ fontSize: 36, marginBottom: 8 }}>
        {t('demos.title')} <span style={{ color: 'var(--coral)' }}>{t('demos.titleHighlight')}</span>
      </h2>
      <p style={{ color: 'var(--ivory-dim)', fontSize: 15, marginBottom: 40 }}>
        {t('demos.subtitle')}
      </p>

      <div className="izimelo-demos-grid" style={{ gap: '24px', textAlign: 'left' }}>
        {IZIMELO_DEMOS.map((demo, idx) => {
          const isPlaying = activeId === demo.id;
          const translatedItem = tBase.items[idx] || demo;

          return (
            <div
              key={demo.id}
              className={`demo-card-container ${isPlaying ? 'playing' : ''}`}
              onClick={() => togglePlay(demo)}
            >
              <img src={demo.coverUrl} alt={demo.title} className="demo-card-bg" />

              <div className="demo-card-overlay">
                {/* Center Play/Pause button */}
                <div className="demo-play-center">
                  {isPlaying ? <Pause size={26} /> : <Play size={26} style={{ marginLeft: 3 }} />}
                </div>

                {/* Bottom Spectrum & Metadata */}
                <div>
                  {/* Spectrum Bar Visualizer Overlay */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: '3px',
                      height: '24px',
                      marginBottom: '8px'
                    }}
                  >
                    {SPECTRUM_BASE_HEIGHTS.map((heightPct, barIdx) => (
                      <div
                        key={barIdx}
                        className={`spectrum-bar ${isPlaying ? 'playing' : ''}`}
                        style={{
                          height: `${heightPct}%`,
                          animationDelay: isPlaying ? `${(barIdx * 0.07) % 0.8}s` : '0s',
                          animationDuration: isPlaying ? `${0.5 + (barIdx % 6) * 0.14}s` : '0s'
                        }}
                      />
                    ))}
                  </div>

                  {/* Title & Subtitle */}
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 2, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                    {translatedItem.title}
                  </h4>
                  <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
                    {translatedItem.genre} · {demo.duration}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

