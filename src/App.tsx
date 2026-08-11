import React, { useState, useEffect } from 'react';
import { IzimeloHeader } from './components/izimelo/IzimeloHeader';
import { IzimeloHero } from './components/izimelo/IzimeloHero';
import { OccasionsTicker } from './components/izimelo/OccasionsTicker';
import { IzimeloHowItWorks } from './components/izimelo/IzimeloHowItWorks';
import { IzimeloPricing } from './components/izimelo/IzimeloPricing';
import { IzimeloDemos } from './components/izimelo/IzimeloDemos';
import { IzimeloCoverFlow } from './components/izimelo/IzimeloCoverFlow';
import { IzimeloTestimonials } from './components/izimelo/IzimeloTestimonials';
import { IzimeloFAQ } from './components/izimelo/IzimeloFAQ';
import { LandingFooter } from './components/landing/LandingFooter';
import { ContactPage } from './features/landing/ContactPage';
import { LegalPage } from './features/landing/LegalPage';

import { SongWizard } from './features/wizard/SongWizard';
import { AudioPreviewModal } from './components/AudioPreviewModal';
import { PaymentModal } from './components/PaymentModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { AuthModal } from './components/auth/AuthModal';
import { AudioPlayer } from './components/player/AudioPlayer';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { ClientDashboard } from './features/dashboard/ClientDashboard';

import { Song, UserProfile } from './types/melodia';
import { songRepository } from './repositories/songRepository';
import { authRepository } from './repositories/authRepository';
import { useToast } from './components/ToastProvider';
import { useTranslation } from './i18n/LanguageContext';
import { d1Database } from './services/d1Service';
import { AnimatedBackground } from './components/AnimatedBackground';

type LandingView = 'home' | 'contact' | 'terms' | 'privacy';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => authRepository.getCurrentUser());
  const { showToast } = useToast();
  const { lang, setLang } = useTranslation();
  const [landingView, setLandingView] = useState<LandingView>('home');

  const [orders, setOrders] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem('sonorya_d1_songs') || localStorage.getItem('melodia_songs_repo');
      const parsed: Song[] = saved ? JSON.parse(saved) : songRepository.getAll();
      // Clean mismatched lyrics from old API-generated songs
      for (const song of parsed) {
        const isApiSong = song.audioUrl && song.audioUrl.startsWith('http') && !song.audioUrl.startsWith('/');
        if (isApiSong && song.lyrics && !localStorage.getItem('sonorya_lyrics_migration_v2')) {
          song.lyrics = '';
        }
      }
      return parsed;
    } catch (e) {
      return songRepository.getAll();
    }
  });

  useEffect(() => {
    d1Database.getSongs().then((savedSongs: Song[]) => {
      if (savedSongs && savedSongs.length > 0) {
        setOrders(savedSongs);
      }
    });
  }, []);

  const [orderDraft, setOrderDraft] = useState<Partial<Song> | null>(null);
  const [dashboardView, setDashboardView] = useState<string>('home');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [intent, setIntent] = useState<'wizard' | null>(null);
  const [showAdminMode, setShowAdminMode] = useState<boolean>(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState<boolean>(false);

  // Player state
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const currentSong = orders.length > 0 ? orders[currentSongIndex] : null;

  useEffect(() => {
    try {
      localStorage.setItem('sonorya_d1_songs', JSON.stringify(orders));
      localStorage.setItem('melodia_songs_repo', JSON.stringify(orders));
      localStorage.setItem('melodia_orders', JSON.stringify(orders));
    } catch (e) {
      // ignore
    }
  }, [orders]);

  const handleOpenWizard = () => {
    if (!user) {
      setAuthMode('login');
      setIntent('wizard');
      setShowAuthModal(true);
      return;
    }
    setDashboardView('create');
  };

  const handleSongCreated = (newSong: Song) => {
    if (user) {
      newSong.userId = user.id;
    }
    songRepository.add(newSong);
    d1Database.saveSong(newSong);
    setOrders((prev) => [newSong, ...prev]);
    setCurrentSongIndex(0);
    setIsPlaying(true);
    setIsPlayerVisible(true);
    setShowHistoryModal(true);
    showToast('Votre chanson a été créée avec succès !', 'success');
  };

  const handleProceedToPayment = () => {
    setShowPreviewModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (completedOrder: Song) => {
    if (user) {
      completedOrder.userId = user.id;
    }
    setShowPaymentModal(false);
    songRepository.add(completedOrder);
    d1Database.saveSong(completedOrder);
    setOrders((prev) => [completedOrder, ...prev]);
    setCurrentSongIndex(0);
    setIsPlaying(true);
    setIsPlayerVisible(true);
    setShowHistoryModal(true);
    showToast('Paiement validé ! Votre commande est enregistrée avec succès...', 'success');
  };

  const handleToggleFavorite = (id: string) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === id ? { ...o, isFavorite: !o.isFavorite } : o);
      const isFav = updated.find(o => o.id === id)?.isFavorite;
      showToast(isFav ? 'Ajouté aux favoris' : 'Retiré des favoris');
      return updated;
    });
  };

  const handlePlaySong = (song: Song) => {
    const idx = orders.findIndex(s => s.id === song.id || (s.title && song.title && s.title.toLowerCase().trim() === song.title.toLowerCase().trim()));
    if (idx !== -1) {
      if (currentSongIndex === idx && isPlaying) {
        setIsPlaying(false);
      } else {
        setCurrentSongIndex(idx);
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(true);
    }
  };

  const [appView, setAppView] = useState<'landing' | 'dashboard' | 'admin'>(() => {
    const saved = sessionStorage.getItem('sonorya_app_view');
    if (saved === 'dashboard' || saved === 'landing' || saved === 'admin') {
      return saved as 'landing' | 'dashboard' | 'admin';
    }
    return 'landing';
  });

  useEffect(() => {
    sessionStorage.setItem('sonorya_app_view', appView);
  }, [appView]);

  const handleLogout = () => {
    authRepository.logout();
    setUser(null);
    setAppView('landing');
    setIsPlaying(false);
    setLandingView('home');
    sessionStorage.removeItem('sonorya_app_view');
  };

  if (appView === 'admin' && user?.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} onBackToLanding={() => setAppView('landing')} />;
  }

  if (appView === 'dashboard' && user) {
    return (
      <div className="app-root">
        <AnimatedBackground />
        <ClientDashboard
          user={user}
          orders={orders}
          onLogout={handleLogout}
          onOpenCreate={handleOpenWizard}
          onSongCreated={handleSongCreated}
          onToggleFavorite={handleToggleFavorite}
          isPlaying={isPlaying}
          currentSongIndex={currentSongIndex}
          setCurrentSongIndex={setCurrentSongIndex}
          setIsPlaying={setIsPlaying}
          onPlaySong={handlePlaySong}
          onUpdateUser={(updated) => setUser({ ...user, ...updated })}
          initialView={dashboardView}
          onBackToLanding={() => setAppView('landing')}
        />

        {/* Preview Modal before Payment */}
        {showPreviewModal && orderDraft && (
          <AudioPreviewModal
            orderDraft={orderDraft}
            onClose={() => setShowPreviewModal(false)}
            onProceedToPayment={handleProceedToPayment}
          />
        )}

        {/* Moneroo Payment Modal */}
        {showPaymentModal && orderDraft && (
          <PaymentModal
            orderDraft={orderDraft}
            onClose={() => setShowPaymentModal(false)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app-root">
      <AnimatedBackground />
      <div className="landing-layout">
        <IzimeloHeader
          user={user}
          onOpenCreate={handleOpenWizard}
          onOpenLogin={() => {
            if (user) {
              setAppView(user.role === 'admin' ? 'admin' : 'dashboard');
            } else {
              setAuthMode('login');
              setIntent(null);
              setShowAuthModal(true);
            }
          }}
          onGoToDashboard={() => setAppView(user?.role === 'admin' ? 'admin' : 'dashboard')}
        />

        <main>
          {landingView === 'home' && (
            <>
              <IzimeloHero onOpenCreate={handleOpenWizard} />
              <OccasionsTicker />
              <IzimeloHowItWorks />
              <IzimeloPricing onOpenCreate={handleOpenWizard} />
              <IzimeloDemos />
              <IzimeloCoverFlow />
              <IzimeloTestimonials />
              <IzimeloFAQ />
            </>
          )}

          {landingView === 'contact' && (
            <ContactPage onBack={() => setLandingView('home')} />
          )}

          {landingView === 'terms' && (
            <LegalPage type="terms" onBack={() => setLandingView('home')} />
          )}

          {landingView === 'privacy' && (
            <LegalPage type="privacy" onBack={() => setLandingView('home')} />
          )}
        </main>

        <LandingFooter onNavigate={(view) => setLandingView(view as LandingView)} onOpenCreate={handleOpenWizard} />
      </div>

      {/* Preview Modal before Payment */}
      {showPreviewModal && orderDraft && (
        <AudioPreviewModal
          orderDraft={orderDraft}
          onClose={() => setShowPreviewModal(false)}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {/* Moneroo Payment Modal */}
      {showPaymentModal && orderDraft && (
        <PaymentModal
          orderDraft={orderDraft}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Order History Modal ("Mes Chansons") */}
      {showHistoryModal && (
        <OrderHistoryModal
          orders={orders}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={(loggedInUser) => {
            setShowAuthModal(false);
            setUser(loggedInUser);
            // Claim all session songs for this logged in user so they stay saved under their account
            setOrders(prev => {
              return prev.map(s => {
                if (!s.userId || s.userId === 'user-current') {
                  const claimed = { ...s, userId: loggedInUser.id };
                  d1Database.saveSong(claimed);
                  return claimed;
                }
                return s;
              });
            });
            if (loggedInUser.role === 'admin') {
              setAppView('admin');
            } else {
              setDashboardView(intent === 'wizard' ? 'create' : 'home');
              setAppView('dashboard');
              setIntent(null);
            }
          }}
        />
      )}

      {/* Sticky Bottom Audio Player (only on landing page, never visible anymore since we don't play songs on landing) */}
    </div>
  );
};

export default App;
