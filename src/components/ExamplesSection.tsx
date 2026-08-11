import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Music, Sparkles, BookOpen } from 'lucide-react';
import { DemoTrack } from '../types/melodia';
import { audioSynth } from '../utils/audioSynth';

export const DEMO_TRACKS: DemoTrack[] = [
  {
    id: 'demo-1',
    title: '« Pour l\'entrée des mariés »',
    occasion: 'Mariage',
    genre: 'Afrobeat',
    durationSeconds: 45,
    snippetDescription: 'Arrangement cuivres afrobeat & chœurs nuptiaux',
    tempo: 118,
    keyNote: '0:45',
    coverUrl: '/images/cover_mariage_afrobeat.png',
    lyrics: `[Couplet Afrobeat]
Ô Adjoa et Kofi, le jour J est enfin arrivé !
Entrez sous les acclamations, que la fête soit lancée !
[Refrain]
C'est votre mariage, la bénédiction de nos ancêtres et de nos cœurs...`,
    audioSampleUrl: '/audios/marriage.mp3'
  },
  {
    id: 'demo-2',
    title: "« 50 ans, l'histoire d'une vie »",
    occasion: 'Anniversaire',
    genre: 'Highlife',
    durationSeconds: 52,
    snippetDescription: 'Guitare highlife dansante & cuivres joyeux',
    tempo: 125,
    keyNote: '0:52',
    coverUrl: '/images/cover_anniversaire_highlife.png',
    lyrics: `[Couplet Highlife]
Cinquante ans de sagesse, de rires et d'amour partagé,
Papa Kodjo, ce soir toute la famille vient te chanter !
[Refrain]
Joyeux anniversaire, 50 ans de bonheur et de santé !`,
    audioSampleUrl: '/audios/Annif.mp3'
  },
  {
    id: 'demo-3',
    title: '« Félicitations pour le BAC »',
    occasion: 'Réussite scolaire',
    genre: 'Gospel',
    durationSeconds: 38,
    snippetDescription: 'Voix émouvante gospel & orgue entraînant',
    tempo: 90,
    keyNote: '0:38',
    coverUrl: '/images/cover_bac_gospel.png',
    lyrics: `[Couplet Gospel]
Tu as travaillé sans relâche, les nuits de révision ont payé,
Bravo Nathanaël pour ton BAC avec mention très bien décroché !
[Refrain]
Gloire et victoire, ton avenir brille de mille feux !`,
    audioSampleUrl: '/audios/bac.mp3'
  },
  {
    id: 'demo-4',
    title: '« La bénédiction de la famille »',
    occasion: 'Dot',
    genre: 'Zouk',
    durationSeconds: 48,
    snippetDescription: 'Zouk doucereux & mélodie romantique',
    tempo: 95,
    keyNote: '0:48',
    coverUrl: '/images/cover_dot_zouk.png',
    lyrics: `[Couplet Zouk]
Les deux familles sont unies autour de la calebasse et du vin,
Pour célébrer votre dot et sceller votre destin.
[Refrain]
L'amour est éternel, béni soit votre chemin...`
  },
  {
    id: 'demo-5',
    title: '« Ambiance & Célébration »',
    occasion: 'Juste pour le plaisir',
    genre: 'Amapiano',
    durationSeconds: 42,
    snippetDescription: 'Basse amapiano percutante & shaker festif',
    tempo: 112,
    keyNote: '0:42',
    coverUrl: '/images/cover_amapiano_party.png',
    lyrics: `[Couplet Amapiano]
Log drum en mouvement, la jeunesse en ébullition,
Pour mon frère Boris, c'est l'heure de la célébration !
[Refrain]
Dansez, chantez, amapiano toute la nuit !`
  },
  {
    id: 'demo-6',
    title: '« Un hommage éternel »',
    occasion: 'Hommage',
    genre: 'Acoustique',
    durationSeconds: 50,
    snippetDescription: 'Piano délicat & guitare acoustique poignante',
    tempo: 85,
    keyNote: '0:50',
    coverUrl: '/images/cover_hommage_acoustique.png',
    lyrics: `[Couplet Acoustique]
Ta mémoire demeure un phare guidant nos pas au quotidien,
Un ange parmi les étoiles, on ne t'oubliera jamais mon bon digne ancien.`,
    audioSampleUrl: '/audios/grand pere.mp3'
  },
];

export const ExamplesSection: React.FC = () => {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<{ [key: string]: number }>({});
  const [expandedLyricsId, setExpandedLyricsId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (track: DemoTrack) => {
    if (activeTrackId === track.id) {
      if (track.audioSampleUrl && audioRef.current) {
        audioRef.current.pause();
      } else {
        audioSynth.stop();
      }
      setActiveTrackId(null);
    } else {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioSynth.stop();
      
      setActiveTrackId(track.id);

      if (track.audioSampleUrl) {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = track.audioSampleUrl;
        audioRef.current.play().catch(console.error);
        
        audioRef.current.ontimeupdate = () => {
          if (audioRef.current) {
            const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgressMap((prev) => ({ ...prev, [track.id]: pct || 0 }));
          }
        };
        audioRef.current.onended = () => {
          setActiveTrackId(null);
          setProgressMap((prev) => ({ ...prev, [track.id]: 0 }));
        };
      } else {
        audioSynth.playTrack(
          track.genre,
          track.durationSeconds || 15,
          (pct) => {
            setProgressMap((prev) => ({ ...prev, [track.id]: pct }));
          },
          () => {
            setActiveTrackId(null);
            setProgressMap((prev) => ({ ...prev, [track.id]: 0 }));
          }
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
    <section className="examples wrap" id="examples">
      <h2>Exemples de Musiques Générées par Sonorya</h2>
      <div className="section-sub">
        Découvrez les morceaux complets avec leurs poches d'album générées par Sonorya et leurs paroles sur-mesure.
      </div>

      <div className="example-grid">
        {DEMO_TRACKS.map((track) => {
          const isPlaying = activeTrackId === track.id;
          const currentProgress = progressMap[track.id] || 0;
          const showLyrics = expandedLyricsId === track.id;

          return (
            <div key={track.id} className="example-card">
              {/* AI Cover Art Banner */}
              <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 170, marginBottom: 14 }}>
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(18,10,30,0.85) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 12
                  }}
                >
                  <div style={{ alignSelf: 'flex-start', background: 'rgba(0,0,0,0.65)', border: '1px solid var(--teal)', color: 'var(--teal)', fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 99, backdropFilter: 'blur(4px)' }}>
                    Pochette IA · {track.genre}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button
                      className="play-btn"
                      style={{ width: 44, height: 44, boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
                      onClick={() => togglePlay(track)}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
                    </button>
                    <span style={{ fontSize: 11, color: 'var(--ivory)', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>
                      {track.keyNote}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="tag">{track.occasion}</div>
                <h4>{track.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--ivory-dim)', marginBottom: 12 }}>
                  {track.snippetDescription}
                </p>
              </div>

              {/* Player Progress Bar */}
              <div className="play-row" style={{ marginBottom: 10 }}>
                <div className="synth-wave">
                  {Array.from({ length: 28 }).map((_, i) => {
                    const isActive = isPlaying && i / 28 <= currentProgress / 100;
                    const randomHeight = Math.floor(30 + Math.sin(i * 0.8) * 35 + (isPlaying ? Math.random() * 30 : 0));
                    return (
                      <span
                        key={i}
                        className={`synth-bar ${isActive ? 'active' : ''}`}
                        style={{ height: `${randomHeight}%` }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Lyrics Toggle */}
              <button
                style={{
                  background: 'rgba(244,239,230,0.06)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--gold-light)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  width: '100%',
                  justifyContent: 'center'
                }}
                onClick={() => setExpandedLyricsId(showLyrics ? null : track.id)}
              >
                <BookOpen size={14} />
                {showLyrics ? 'Masquer les paroles' : 'Voir les paroles écrites par Sonorya'}
              </button>

              {showLyrics && (
                <div style={{ marginTop: 10, background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 12, fontSize: 12, color: 'var(--ivory-dim)', fontStyle: 'italic', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {track.lyrics}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
