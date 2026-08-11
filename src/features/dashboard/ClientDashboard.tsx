import React, { useState } from 'react';
import { UserProfile, Song } from '../../types/melodia';
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
  onBackToLanding
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

  return (
    <div className="client-dashboard-layout" style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden' }}>
      <DashboardSidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onLogout={onLogout} 
        onOpenCreate={handleCreateTrigger}
        onBackToLanding={onBackToLanding}
      />
      
      {currentView === 'create' ? (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', height: '100vh', overflow: 'hidden' }}>
          <main className="dashboard-main" style={{ padding: '24px 32px 100px', overflowY: 'auto' }}>
            <SongWizard
              isEmbedded={true}
              user={user}
              onUpdateUser={onUpdateUser}
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
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', height: '100vh', overflow: 'hidden' }}>
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
    </div>
  );
};
