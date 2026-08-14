import React, { useState } from 'react';
import { UserProfile, Song } from '../../types/melodia';
import { Home, Compass, PlusCircle, Library, User } from 'lucide-react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardMain } from './DashboardMain';
import { DashboardPlayer } from './DashboardPlayer';
import { LyricsDisplayPanel } from './LyricsDisplayPanel';
import { SongWizard } from '../wizard/SongWizard';

interface ClientDashboardProps {
  user: UserProfile;
  orders: Song[];
  onLogout: () => void;
  onOpenCreate: () => void;
  onSongCreated: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
  isPlaying: boolean;
  currentSongIndex: number;
  setCurrentSongIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  onPlaySong: (song: Song) => void;
  onUpdateUser: (updatedUser: Partial<UserProfile>) => void;
  initialView?: string;
  onBackToLanding?: () => void;
  onOpenRechargeCredits?: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ 
  user, 
  orders, 
  onLogout,
  onOpenCreate,
  onSongCreated,
  onToggleFavorite,
  isPlaying,
  currentSongIndex,
  setCurrentSongIndex,
  setIsPlaying,
  onPlaySong,
  onUpdateUser,
  initialView = 'home',
  onBackToLanding,
  onOpenRechargeCredits
}) => {
  const [currentView, setCurrentView] = useState(initialView);
  const [draftInfo, setDraftInfo] = useState<{ title?: string; lyrics?: string; genre?: string }>({});
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(180);

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  // Filter orders to contain ONLY songs created by THIS specific user
  const userCreatedOrders = React.useMemo(() => {
    if (!user?.id) return [];
    return orders.filter(s => s.userId === user.id);
  }, [orders, user?.id]);

  const currentSong = selectedSong || (userCreatedOrders.length > 0 ? userCreatedOrders[0] : null);

  React.useEffect(() => {
    if (initialView) {
      setCurrentView(initialView);
    }
  }, [initialView]);

  const handlePlaySongCustom = (song: Song) => {
    if (currentSong?.id === song.id && isPlaying) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedSong(song);
      setIsPlaying(true);
    }
    onPlaySong(song);
  };

  const handleNext = () => {
    if (userCreatedOrders.length > 0) {
      setCurrentSongIndex((currentSongIndex + 1) % userCreatedOrders.length);
      setSelectedSong(userCreatedOrders[(currentSongIndex + 1) % userCreatedOrders.length]);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (userCreatedOrders.length > 0) {
      const prevIdx = (currentSongIndex - 1 + userCreatedOrders.length) % userCreatedOrders.length;
      setCurrentSongIndex(prevIdx);
      setSelectedSong(userCreatedOrders[prevIdx]);
      setIsPlaying(true);
    }
  };

  const handleCreateTrigger = () => {
    setCurrentView('create');
    onOpenCreate();
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="client-dashboard-layout">
      {/* MOBILE TOP HEADER */}
      <header className="mobile-dashboard-header">
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          onClick={() => {
            if (onBackToLanding) onBackToLanding();
            else setCurrentView('home');
          }}
        >
          <img src="/images/sonorya-app-logo.png" alt="Sonorya Logo" style={{ width: 24, height: 24, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 700, color: 'var(--ivory)' }}>
            Sonorya<span style={{ color: 'var(--coral)' }}>.</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* User Credits Pill */}
          <button 
            onClick={onOpenRechargeCredits}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(212, 161, 57, 0.12)',
              border: '1px solid rgba(212, 161, 57, 0.3)',
              borderRadius: 99,
              padding: '4px 10px',
              color: 'var(--gold)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span>⚡ {(user?.songCredits || 0) + (user?.bonusCredits || 0)}</span>
            <span style={{ fontSize: 10, background: 'var(--gold)', color: '#120A1E', borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</span>
          </button>

          {/* Hamburger Menu Button */}
          <button 
            className="mobile-menu-trigger-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Ouvrir le menu"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: '7px 9px',
              color: 'var(--ivory)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 18 }}>
              <span style={{ display: 'block', height: 2, background: 'var(--ivory)', borderRadius: 2 }} />
              <span style={{ display: 'block', height: 2, background: 'var(--ivory)', borderRadius: 2 }} />
              <span style={{ display: 'block', height: 2, background: 'var(--ivory)', borderRadius: 2 }} />
            </div>
          </button>
        </div>
      </header>

      {/* SIDEBAR (Desktop sidebar + Mobile Drawer) */}
      <DashboardSidebar 
        currentView={currentView} 
        onNavigate={(view) => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }} 
        onLogout={onLogout} 
        onOpenCreate={handleCreateTrigger}
        onBackToLanding={onBackToLanding}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      {currentView === 'create' ? (
        <div className="dashboard-main-wrapper">
          <main className="dashboard-main" style={{ padding: '24px 32px 100px', overflowY: 'auto' }}>
            <SongWizard
              isEmbedded={true}
              user={user}
              onUpdateUser={onUpdateUser}
              onOpenRechargeCredits={onOpenRechargeCredits}
              onClose={() => setCurrentView('home')}
              onSongCreated={(newSong) => {
                onSongCreated(newSong);
                setCurrentView('home');
              }}
              onDraftChange={setDraftInfo}
            />
          </main>
          <LyricsDisplayPanel
            currentSong={currentSong}
            draftTitle={draftInfo.title}
            draftLyrics={draftInfo.lyrics}
            draftGenre={draftInfo.genre}
            isPlaying={isPlaying}
            currentTime={audioCurrentTime}
            duration={audioDuration}
          />
        </div>
      ) : (
        <div className="dashboard-main-wrapper">
          <DashboardMain 
            user={user}
            orders={userCreatedOrders} 
            onPlaySong={handlePlaySongCustom}
            onOpenCreate={handleCreateTrigger}
            currentView={currentView}
            onUpdateUser={onUpdateUser}
            onLogout={onLogout}
          />
          <LyricsDisplayPanel
            currentSong={currentSong}
            isPlaying={isPlaying}
            currentTime={audioCurrentTime}
            duration={audioDuration}
          />
        </div>
      )}

      <DashboardPlayer 
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrev={handlePrev}
        onToggleFavorite={onToggleFavorite}
        onTimeUpdate={(curTime, dur) => {
          setAudioCurrentTime(curTime);
          setAudioDuration(dur);
        }}
      />

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="mobile-bottom-nav">
        <button className={currentView === 'home' ? 'active' : ''} onClick={() => setCurrentView('home')}>
          <Home size={20} />
          <span>Accueil</span>
        </button>
        <button className={currentView === 'explore' ? 'active' : ''} onClick={() => setCurrentView('explore')}>
          <Compass size={20} />
          <span>Explorer</span>
        </button>
        <button className={currentView === 'create' ? 'active' : ''} onClick={() => { setCurrentView('create'); onOpenCreate(); }}>
          <PlusCircle size={24} style={{ color: currentView === 'create' ? 'var(--gold)' : 'var(--ivory)' }} />
          <span style={{ color: currentView === 'create' ? 'var(--gold)' : 'inherit' }}>Créer</span>
        </button>
        <button className={currentView === 'recent' ? 'active' : ''} onClick={() => setCurrentView('recent')}>
          <Library size={20} />
          <span>Chansons</span>
        </button>
        <button className={currentView === 'profile' ? 'active' : ''} onClick={() => setCurrentView('profile')}>
          <User size={20} />
          <span>Profil</span>
        </button>
      </div>
    </div>
  );
};
