import React from 'react';
import { Music2, Sparkles, Disc, Layers } from 'lucide-react';
import { Song } from '../../types/melodia';

export interface LyricsDisplayPanelProps {
  currentSong: Song | null;
  draftTitle?: string;
  draftLyrics?: string;
  draftGenre?: string;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
}

export const LyricsDisplayPanel: React.FC<LyricsDisplayPanelProps> = ({
  currentSong,
  draftTitle,
  draftLyrics,
  draftGenre,
  isPlaying = false,
  currentTime = 0,
  duration = 180
}) => {
  const displayTitle = currentSong?.title || draftTitle || 'Chanson Sur-Mesure Sonorya';
  const displayGenre = currentSong?.genre || draftGenre || 'Afrobeat / Amapiano';
  
  const rawLyrics = currentSong?.lyrics || draftLyrics || '';
  const hasLyrics = Boolean(rawLyrics.trim());

  const lines = React.useMemo(() => {
    return rawLyrics.split('\n');
  }, [rawLyrics]);

  const [activeLineIndex, setActiveLineIndex] = React.useState<number>(0);
  const activeLineRef = React.useRef<HTMLDivElement | null>(null);

  // Exact Audio-Lyrics Synchronization based on audio playback currentTime
  React.useEffect(() => {
    if (!isPlaying || lines.length <= 1) {
      setActiveLineIndex(0);
      return;
    }

    const playableIndices: number[] = [];
    lines.forEach((line, idx) => {
      if (line.trim() && !line.trim().startsWith('[')) {
        playableIndices.push(idx);
      }
    });

    if (playableIndices.length === 0) return;

    const progressRatio = Math.min(0.99, Math.max(0, currentTime / (duration || 180)));
    const targetStep = Math.min(playableIndices.length - 1, Math.floor(progressRatio * playableIndices.length));
    const nextActive = playableIndices[targetStep];
    
    if (nextActive !== activeLineIndex) {
      setActiveLineIndex(nextActive);
    }
  }, [isPlaying, currentTime, duration, lines]);

  // Smooth auto-scroll to active lyric line
  React.useEffect(() => {
    if (activeLineRef.current && isPlaying) {
      activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeLineIndex, isPlaying]);

  return (
    <aside
      className="dashboard-right-panel"
      style={{
        background: '#12141D',
        borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px 24px 28px',
        height: '100vh',
        minHeight: '100vh',
        maxHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      {/* Background Animated Soundwave Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '-20%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: isPlaying
            ? 'radial-gradient(circle, rgba(45,212,191,0.3) 0%, rgba(245,185,120,0.2) 45%, transparent 75%)'
            : 'radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 75%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'all 0.5s ease'
        }}
      />

      {/* Header: Cover Art / Logo Icon & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, position: 'relative', zIndex: 1 }}>
        <div style={{ width: 44, height: 44, flexShrink: 0 }}>
          {currentSong?.coverUrl ? (
            <img
              src={currentSong.coverUrl}
              alt="Cover"
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                objectFit: 'cover',
                boxShadow: isPlaying ? '0 0 16px rgba(45,212,191,0.6)' : '0 4px 14px rgba(0,0,0,0.5)',
                animation: isPlaying ? 'vinylSpin 8s linear infinite' : 'none'
              }}
            />
          ) : (
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #2DD4BF, #F5B978)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(45,212,191,0.35)'
              }}
            >
              <Music2 size={22} color="#FFFFFF" />
            </div>
          )}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <h3
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: 'Manrope, sans-serif',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {displayTitle}
          </h3>
          <div style={{ fontSize: 11, color: '#2DD4BF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            {isPlaying ? 'Chanté en Direct' : 'Paroles Sonorya'}
          </div>
        </div>
      </div>

      {/* Lyrics Body Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          position: 'relative',
          zIndex: 1,
          paddingRight: 6,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          paddingTop: 8,
          paddingBottom: 20
        }}
      >
        {hasLyrics ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {lines.map((line, idx) => {
              const trimmed = line.trim();
              const isHeader = trimmed.startsWith('[') && trimmed.endsWith(']');
              const isActive = isPlaying && idx === activeLineIndex;

              if (isHeader) {
                return (
                  <div
                    key={idx}
                    style={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      color: 'var(--coral)',
                      textTransform: 'uppercase',
                      letterSpacing: 1.2,
                      marginTop: idx > 0 ? 14 : 0,
                      marginBottom: 4,
                      opacity: 0.9
                    }}
                  >
                    {line}
                  </div>
                );
              }

              if (!trimmed) {
                return <div key={idx} style={{ height: 10 }} />;
              }

              return (
                <div
                  key={idx}
                  ref={isActive ? activeLineRef : null}
                  style={{
                    padding: isActive ? '8px 14px' : '4px 8px',
                    borderRadius: isActive ? 12 : 6,
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(45, 212, 191, 0.24) 0%, rgba(245, 185, 120, 0.18) 100%)'
                      : 'transparent',
                    borderLeft: isActive ? '4px solid #2DD4BF' : '4px solid transparent',
                    color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                    fontSize: isActive ? 15.5 : 14,
                    fontWeight: isActive ? 800 : 500,
                    textShadow: isActive ? '0 0 12px rgba(45, 212, 191, 0.8), 0 0 20px rgba(245, 185, 120, 0.4)' : 'none',
                    transform: isActive ? 'scale(1.02)' : 'none',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isActive ? '0 4px 16px rgba(45, 212, 191, 0.2)' : 'none'
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed rgba(255, 255, 255, 0.12)',
              borderRadius: 20,
              padding: '36px 20px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: currentSong ? 'rgba(245, 185, 120, 0.12)' : 'rgba(45, 212, 191, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: currentSong ? '1px solid rgba(245, 185, 120, 0.3)' : '1px solid rgba(45, 212, 191, 0.3)'
              }}
            >
              {currentSong ? (
                <Music2 size={24} style={{ color: '#F5B978' }} />
              ) : (
                <Sparkles size={24} style={{ color: '#2DD4BF' }} />
              )}
            </div>
            {currentSong ? (
              <>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 8, fontFamily: 'Manrope, sans-serif' }}>
                  🎵 Musique Générée par Sonorya
                </h4>
                <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>
                  Cette chanson a été composée et interprétée par Sonorya. Les paroles synchronisées seront disponibles pour vos prochaines créations.
                </p>
              </>
            ) : (
              <>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 8, fontFamily: 'Manrope, sans-serif' }}>
                  Aperçu des Paroles en Direct
                </h4>
                <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>
                  Saisissez votre histoire ou collez vos paroles dans le panneau de gauche. L'aperçu s'affichera ici instantanément.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer: Style Badge */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: 16,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600, marginBottom: 4 }}>
          Style
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#2DD4BF', fontFamily: 'Manrope, sans-serif' }}>
          {displayGenre.toLowerCase()}
        </div>
      </div>
    </aside>
  );
};
