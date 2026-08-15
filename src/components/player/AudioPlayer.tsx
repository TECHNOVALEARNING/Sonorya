import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Heart, Download, Share2, Volume2, Maximize2, X, BookOpen } from 'lucide-react';
import { Song } from '../../types/melodia';
import { audioSynth } from '../../utils/audioSynth';

interface AudioPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onToggleFavorite: (id: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onClosePlayer?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  onToggleFavorite,
  onNext,
  onPrev,
  onClosePlayer
}) => {
  const [progress, setProgress] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!currentSong) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current && audioRef.current.duration) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      });
      
      audioRef.current.addEventListener('ended', () => {
        if (isRepeat) {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(console.warn);
          }
        } else {
          onNext();
        }
      });
    }

    const audio = audioRef.current;
    
    // Si la chanson a changé, mettre à jour la source
    const audioUrl = currentSong.audioUrl || currentSong.previewAudioUrl;
    if (audioUrl && audio.src !== audioUrl) {
      audio.src = audioUrl;
      audio.load();
    }

    if (isPlaying) {
      audio.playbackRate = speed;
      audio.play().catch((e) => console.warn('Erreur lecture audio:', e));
    } else {
      audio.pause();
    }

    return () => {
      // Cleanup happens only on unmount or full stop
    };
  }, [currentSong?.id, isPlaying, isRepeat, speed]);

  // Clean up audio on unmount completely
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!currentSong) return null;

  const durationSec = currentSong.durationSeconds || 180;
  const currentSeconds = Math.floor((progress / 100) * durationSec);
  const remainingSeconds = durationSec - currentSeconds;

  const formatTime = (sec: number) => {
    if (isNaN(sec) || sec === Infinity || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const speeds = [0.5, 1.0, 1.25, 1.5, 2.0];

  const handleSpeedCycle = () => {
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  return (
    <>
      <div className="sticky-player">
        {/* Left Track Summary */}
        <div className="player-left">
          <div
            style={{ width: 54, height: 54, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => setShowFullPlayer(true)}
          >
            <img src={currentSong.coverUrl} alt={currentSong.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => setShowFullPlayer(true)}>
            <div style={{ fontSize: 14.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentSong.title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--coral)' }}>
              Pour {currentSong.recipientName} · {currentSong.genre}
            </div>
          </div>

          <button
            style={{ background: 'none', border: 'none', color: currentSong.isFavorite ? 'var(--coral)' : 'var(--ivory-muted)', cursor: 'pointer', marginLeft: 6 }}
            onClick={() => onToggleFavorite(currentSong.id)}
          >
            <Heart size={18} fill={currentSong.isFavorite ? 'var(--coral)' : 'none'} />
          </button>
        </div>

        {/* Center Controls & Progress */}
        <div className="player-center">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              style={{ background: 'none', border: 'none', color: isShuffle ? 'var(--coral)' : 'var(--ivory-muted)', cursor: 'pointer' }}
              onClick={() => setIsShuffle(!isShuffle)}
              title="Lecture aléatoire"
            >
              <Shuffle size={16} />
            </button>

            <button style={{ background: 'none', border: 'none', color: 'var(--ivory)', cursor: 'pointer' }} onClick={onPrev}>
              <SkipBack size={18} />
            </button>

            <button
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--coral), var(--coral-hover))',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(255,107,91,0.4)'
              }}
              onClick={onTogglePlay}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
            </button>

            <button style={{ background: 'none', border: 'none', color: 'var(--ivory)', cursor: 'pointer' }} onClick={onNext}>
              <SkipForward size={18} />
            </button>

            <button
              style={{ background: 'none', border: 'none', color: isRepeat ? 'var(--coral)' : 'var(--ivory-muted)', cursor: 'pointer' }}
              onClick={() => setIsRepeat(!isRepeat)}
              title="Répétition"
            >
              <Repeat size={16} />
            </button>

            <button
              style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'var(--coral)', fontSize: 11, fontWeight: 700, padding: '3px 7px', borderRadius: 4, cursor: 'pointer' }}
              onClick={handleSpeedCycle}
            >
              {speed}x
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
            <span style={{ fontSize: 11, color: 'var(--ivory-muted)', minWidth: 32 }}>{formatTime(currentSeconds)}</span>
            <div
              style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.12)', borderRadius: 99, cursor: 'pointer', position: 'relative' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPct = (clickX / rect.width) * 100;
                setProgress(newPct);
              }}
            >
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--coral)', borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--ivory-muted)', minWidth: 32 }}>-{formatTime(remainingSeconds)}</span>
          </div>
        </div>

        {/* Right Tools */}
        <div className="player-right">
          <button
            style={{ background: 'none', border: 'none', color: 'var(--ivory-dim)', cursor: 'pointer' }}
            onClick={() => {
              const text = encodeURIComponent(`🎶 Écoute la chanson IA pour ${currentSong.recipientName} : ${currentSong.title}`);
              window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
            }}
          >
            <Share2 size={16} />
          </button>

          <a
            href={currentSong.audioUrl}
            download={`${currentSong.title}.mp3`}
            onClick={(e) => {
              e.preventDefault();
              alert(`Téléchargement MP3 HD lancé pour "${currentSong.title}" !`);
            }}
            style={{ color: 'var(--ivory-dim)' }}
          >
            <Download size={16} />
          </a>

          <button
            style={{ background: 'none', border: 'none', color: 'var(--ivory-dim)', cursor: 'pointer' }}
            onClick={() => setShowFullPlayer(true)}
          >
            <Maximize2 size={16} />
          </button>

          {onClosePlayer && (
            <button
              style={{ background: 'none', border: 'none', color: 'var(--coral)', cursor: 'pointer', marginLeft: 8 }}
              onClick={onClosePlayer}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen Player Modal */}
      {showFullPlayer && (
        <div className="modal-overlay" onClick={() => setShowFullPlayer(false)}>
          <div className="modal-content" style={{ maxWidth: 640, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowFullPlayer(false)}>
              <X size={18} />
            </button>

            <div style={{ fontSize: 12, color: 'var(--coral)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>
              LECTEUR AUDIO PLEIN ÉCRAN
            </div>

            <div style={{ width: 220, height: 220, borderRadius: 20, overflow: 'hidden', margin: '0 auto 20px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
              <img src={currentSong.coverUrl} alt={currentSong.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h3 style={{ fontSize: 24, marginBottom: 4 }}>{currentSong.title}</h3>
            <p style={{ color: 'var(--coral)', fontSize: 14, marginBottom: 20 }}>
              Pour {currentSong.recipientName} · {currentSong.occasion} ({currentSong.genre})
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
              <button className="btn-glass" onClick={() => setShowLyrics(!showLyrics)}>
                <BookOpen size={16} /> {showLyrics ? 'Masquer paroles' : 'Voir paroles IA'}
              </button>
            </div>

            {showLyrics && (
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 16, padding: 18, fontSize: 13, color: 'var(--ivory-dim)', fontStyle: 'italic', textAlign: 'left', maxHeight: 200, overflowY: 'auto', whiteSpace: 'pre-wrap', marginBottom: 20 }}>
                {currentSong.lyrics}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
