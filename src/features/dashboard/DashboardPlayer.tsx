import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Heart, Share2, Download, Volume2, VolumeX, RotateCcw, RotateCw } from 'lucide-react';
import { Song } from '../../types/melodia';
import { audioSynth } from '../../utils/audioSynth';
import { useToast } from '../../components/ToastProvider';
import { useTranslation } from '../../i18n/LanguageContext';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleFavorite: (id: string) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const DashboardPlayer: React.FC<PlayerProps> = ({ 
  currentSong, 
  isPlaying, 
  onTogglePlay, 
  onNext, 
  onPrev, 
  onToggleFavorite, 
  onTimeUpdate 
}) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [elapsed, setElapsed] = useState('0:00');
  const [realDuration, setRealDuration] = useState<number | null>(null);
  const { showToast } = useToast();

  const parseDurationString = (str?: string): number => {
    if (!str) return 0;
    const parts = str.split(':');
    if (parts.length === 2) {
      const mins = parseInt(parts[0], 10);
      const secs = parseInt(parts[1], 10);
      if (!isNaN(mins) && !isNaN(secs)) return mins * 60 + secs;
    }
    return 0;
  };

  const parsedDuration = parseDurationString((currentSong as any)?.duration);
  const fallbackDuration = currentSong?.durationSeconds || parsedDuration || 175;
  const effectiveDuration = realDuration || fallbackDuration;

  const formatTime = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const totalFormatted = formatTime(effectiveDuration);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const effectiveVol = isMuted ? 0 : volume / 100;
    if (audioRef.current) {
      audioRef.current.volume = effectiveVol;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && currentSong) {
      const isRealAudioFile = currentSong.audioUrl && (
        currentSong.audioUrl.startsWith('http') || 
        currentSong.audioUrl.endsWith('.mp3') || 
        currentSong.audioUrl.startsWith('/audios/')
      );

      if (isRealAudioFile) {
        audioSynth.stop();
        const rawUrl = currentSong.audioUrl || '';
        const cleanUrl = encodeURI(decodeURI(rawUrl));
        const targetSrc = new URL(cleanUrl, window.location.href).href;

        if (!audioRef.current) {
          audioRef.current = new Audio(targetSrc);
        } else if (audioRef.current.src !== targetSrc) {
          audioRef.current.pause();
          audioRef.current.src = targetSrc;
          setRealDuration(null);
          setProgress(0);
          setElapsed('0:00');
        }

        audioRef.current.volume = isMuted ? 0 : volume / 100;

        audioRef.current.onloadedmetadata = () => {
          if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
            setRealDuration(audioRef.current.duration);
          }
        };

        audioRef.current.ontimeupdate = () => {
          if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
            const curTime = audioRef.current.currentTime;
            const dur = audioRef.current.duration;
            setRealDuration(dur);
            const pct = (curTime / dur) * 100;
            setProgress(pct);
            setElapsed(formatTime(curTime));
            if (onTimeUpdate) onTimeUpdate(curTime, dur);
          }
        };

        audioRef.current.onended = () => {
          if (isRepeat && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(console.error);
          } else {
            onNext();
          }
        };

        const playFallback = () => {
          if (audioRef.current) audioRef.current.pause();
          audioSynth.playTrack(
            currentSong.genre,
            effectiveDuration,
            currentSong.lyrics,
            currentSong.language || 'Français',
            currentSong.voiceGender || 'Duo / Mixte',
            (pct) => {
              setProgress(pct);
              const curTime = (pct / 100) * effectiveDuration;
              setElapsed(formatTime(curTime));
              if (onTimeUpdate) onTimeUpdate(curTime, effectiveDuration);
            },
            onNext
          );
        };

        audioRef.current.onerror = () => {
          playFallback();
        };

        if (audioRef.current.paused) {
          audioRef.current.play().catch(() => {
            playFallback();
          });
        }
      } else {
        if (audioRef.current) audioRef.current.pause();
        audioSynth.playTrack(
          currentSong.genre,
          effectiveDuration,
          currentSong.lyrics,
          currentSong.language || 'Français',
          currentSong.voiceGender || 'Duo / Mixte',
          (pct) => {
            setProgress(pct);
            const curTime = (pct / 100) * effectiveDuration;
            setElapsed(formatTime(curTime));
            if (onTimeUpdate) onTimeUpdate(curTime, effectiveDuration);
          },
          onNext
        );
      }
    } else {
      if (audioRef.current) audioRef.current.pause();
      audioSynth.stop();
    }

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [isPlaying, currentSong?.id, currentSong?.audioUrl]);

  // Click on progress bar to seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentSong) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    if (width <= 0) return;

    const pct = Math.max(0, Math.min(100, (clickX / width) * 100));
    setProgress(pct);

    const totalSec = (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration))
      ? audioRef.current.duration
      : effectiveDuration;

    const targetTime = (pct / 100) * totalSec;
    setElapsed(formatTime(targetTime));

    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      audioRef.current.currentTime = targetTime;
    }
    if (onTimeUpdate) onTimeUpdate(targetTime, totalSec);
  };

  // Skip delta (10s forward or backward)
  const handleSeekDelta = (deltaSeconds: number) => {
    const totalSec = (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration))
      ? audioRef.current.duration
      : effectiveDuration;

    let curTime = 0;
    if (audioRef.current) {
      curTime = audioRef.current.currentTime || 0;
    } else {
      curTime = (progress / 100) * totalSec;
    }

    const newTime = Math.max(0, Math.min(totalSec, curTime + deltaSeconds));
    const newPct = (newTime / totalSec) * 100;

    setProgress(newPct);
    setElapsed(formatTime(newTime));

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    if (onTimeUpdate) onTimeUpdate(newTime, totalSec);
  };

  const handleDownload = () => {
    if (!currentSong) return;
    const link = document.createElement('a');
    link.href = currentSong.audioUrl || '#';
    link.download = `${currentSong.title || 'sonorya-song'}.mp3`;
    link.click();
    showToast(t('player.downloadStarted'), 'success');
  };

  const handleShare = async () => {
    if (!currentSong) return;
    if (navigator.share) {
      await navigator.share({
        title: currentSong.title || t('player.shareTitle'),
        text: `${t('player.shareText')} "${currentSong.title}" ${t('player.shareTextSuffix')}`,
        url: window.location.href
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast(t('player.copied'), 'success');
    }
  };

  const songTitle = currentSong?.title || 'Chanson Personnalisée Sonorya';
  const songRecipient = currentSong?.recipientName || 'Sonorya Studio';
  const songCover = currentSong?.coverUrl || '/images/cover_amapiano_party.png';
  const isFav = currentSong?.isFavorite || false;

  return (
    <div
      className="dashboard-horizontal-player"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 240,
        right: 360,
        height: 76,
        background: 'linear-gradient(180deg, rgba(45,212,191,0.15) 0%, rgba(18,20,29,0.98) 40%, #12141D 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(45, 212, 191, 0.25)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8), 0 -2px 15px rgba(45, 212, 191, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 1000
      }}
    >
      {/* Left: Cover Art, Title & Mode Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 260 }}>
        <img
          src={songCover}
          alt="Cover"
          style={{
            width: 50,
            height: 50,
            borderRadius: isPlaying ? '50%' : '12px',
            objectFit: 'cover',
            border: isPlaying ? '2px solid rgba(45, 212, 191, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: isPlaying ? '0 0 20px rgba(45, 212, 191, 0.6), 0 4px 14px rgba(0, 0, 0, 0.7)' : '0 4px 14px rgba(0, 0, 0, 0.5)',
            animation: isPlaying ? 'vinylSpin 6s linear infinite' : 'none',
            transition: 'border-radius 0.4s ease, border 0.4s ease, box-shadow 0.4s ease',
            flexShrink: 0
          }}
        />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Manrope, sans-serif' }}>
            {songTitle}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
            {t('home.for')} {songRecipient}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
          <button 
            onClick={() => setIsShuffle(!isShuffle)} 
            style={{ background: 'none', border: 'none', color: isShuffle ? '#2DD4BF' : 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 4 }} 
            title="Lecture Aléatoire (Shuffle)"
          >
            <Shuffle size={16} />
          </button>
          <button 
            onClick={() => setIsRepeat(!isRepeat)} 
            style={{ background: 'none', border: 'none', color: isRepeat ? '#2DD4BF' : 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 4 }} 
            title="Répéter la chanson (Repeat)"
          >
            <Repeat size={16} />
          </button>
        </div>
      </div>

      {/* Center: Controls & Scrubber */}
      <div style={{ flex: 1, maxWidth: 640, margin: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={onPrev} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }} title="Piste précédente">
            <SkipBack size={18} fill="currentColor" />
          </button>
          
          <button onClick={() => handleSeekDelta(-10)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }} title="Reculer de 10 sec">
            <RotateCcw size={16} />
          </button>

          <button
            onClick={onTogglePlay}
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: '#FFFFFF',
              color: '#0F172A',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(255,255,255,0.35)'
            }}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: 2 }} />}
          </button>

          <button onClick={() => handleSeekDelta(10)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }} title="Avancer de 10 sec">
            <RotateCw size={16} />
          </button>

          <button onClick={onNext} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }} title="Piste suivante">
            <SkipForward size={18} fill="currentColor" />
          </button>
        </div>

        {/* Progress Bar & Time */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, minWidth: 36, textAlign: 'right' }}>{elapsed}</span>
          <div 
            onClick={handleSeek}
            style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 99, position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #2DD4BF, #0EA5E9)', borderRadius: 99 }} />
            <div style={{ position: 'absolute', left: `calc(${progress}% - 6px)`, width: 12, height: 12, background: '#2DD4BF', borderRadius: '50%', boxShadow: '0 0 12px #2DD4BF' }} />
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, minWidth: 36 }}>{totalFormatted}</span>
        </div>
      </div>

      {/* Right: Volume & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 220, justifyContent: 'flex-end' }}>
        <button onClick={() => currentSong && onToggleFavorite(currentSong.id)} style={{ background: 'none', border: 'none', color: isFav ? '#2DD4BF' : 'rgba(255,255,255,0.6)', cursor: 'pointer' }} title="Ajouter aux favoris">
          <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
        </button>
        <button onClick={handleShare} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }} title={t('player.share')}>
          <Share2 size={18} />
        </button>
        <button onClick={handleDownload} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }} title={t('player.download')}>
          <Download size={18} />
        </button>

        {/* Volume Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 110, marginLeft: 6 }}>
          <button onClick={() => setIsMuted(!isMuted)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: 0 }}>
            {isMuted || volume === 0 ? <VolumeX size={16} style={{ color: '#FF6B5B' }} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => { setIsMuted(false); setVolume(Number(e.target.value)); }}
            style={{ width: '100%', accentColor: '#2DD4BF', cursor: 'pointer' }}
            title={`Volume: ${isMuted ? 0 : volume}%`}
          />
        </div>
      </div>
    </div>
  );
};
