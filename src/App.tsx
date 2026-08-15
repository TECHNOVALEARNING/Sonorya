import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
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
import { CreditPurchaseModal } from './components/CreditPurchaseModal';
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
import { supabase } from './services/supabaseClient';

type LandingView = 'home' | 'contact' | 'terms' | 'privacy';

export const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<UserProfile | null>(() => authRepository.getCurrentUser());
  
  useEffect(() => {
    const unsubscribe = authRepository.subscribe((updatedUser) => {
      setUser(updatedUser);
    });
    return () => unsubscribe();
  }, []);

  // Intercepter les retours de paiement Moneroo
  // Le flux est entièrement sécurisé : Moneroo metadata → API serveur → Supabase
  const creditPaymentProcessedRef = React.useRef(false);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status');
    const paymentId = urlParams.get('paymentId') || urlParams.get('payment_id') || urlParams.get('transaction_id');
    
    if (!paymentStatus) return;
    
    // Toujours basculer vers le dashboard au retour de Moneroo
    navigate('/dashboard');
    
    // Traitement des achats de crédits
    if (paymentStatus === 'verify' && !creditPaymentProcessedRef.current) {
      const processCredits = async () => {
        if (!paymentId) {
          console.warn('[PAYMENT] No paymentId in URL, cannot verify.');
          return;
        }

        creditPaymentProcessedRef.current = true; // Empêcher la double exécution (Strict Mode)

        try {
          console.log('[PAYMENT] Verifying & crediting via server. PaymentId:', paymentId);
          
          // Récupérer le token Supabase de l'utilisateur connecté pour passer les politiques RLS
          const sessionData = await supabase.auth.getSession();
          const token = sessionData.data.session?.access_token || '';

          // Appel au endpoint sécurisé côté serveur
          const response = await fetch('/api/moneroo/credit', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ transactionId: paymentId })
          });
          
          const result = await response.json();
          console.log('[PAYMENT] Server credit response:', result);
          
          if (result.success) {
            // Re-synchroniser le profil depuis Supabase (qui a les crédits mis à jour)
            // authRepository.syncProfile va relire la BDD et notifier les listeners
            const freshUser = authRepository.getCurrentUser();
            if (freshUser) {
              authRepository.setCurrentUserLocally({ songCredits: result.credits });
              setUser({ ...freshUser, songCredits: result.credits });
            }
            
            window.history.replaceState({}, document.title, window.location.pathname);
            
            setTimeout(() => {
              showToast(`🎉 Paiement réussi ! ${result.added} crédits ajoutés à votre compte. Total : ${result.credits}`, 'success');
            }, 300);
          } else {
            creditPaymentProcessedRef.current = false;
            window.history.replaceState({}, document.title, window.location.pathname);
            showToast(result.error || 'Paiement non confirmé.', 'error');
          }
        } catch (e) {
          console.error('[PAYMENT] Erreur vérification crédits:', e);
          creditPaymentProcessedRef.current = false;
          window.history.replaceState({}, document.title, window.location.pathname);
          showToast('Erreur de vérification du paiement.', 'error');
        }
      };
      
      // Attendre que l'utilisateur soit chargé avant de traiter
      const currentUser = user || authRepository.getCurrentUser();
      if (currentUser) {
        processCredits();
      }
    } else if (paymentStatus === 'verify_song' && paymentId) {
      // Pour les chansons, vérifier via le même endpoint puis restaurer le wizard
      navigate('/create');
      navigate('/dashboard');
      
      // Vérifier la transaction et récupérer les metadata (données du wizard)
      if (!creditPaymentProcessedRef.current) {
        creditPaymentProcessedRef.current = true;
        
        fetch('/api/moneroo/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId: paymentId })
        })
        .then(r => r.json())
        .then(verifyData => {
          const txStatus = String(verifyData.data?.status || verifyData.status || '').toLowerCase();
          const metadata = verifyData.data?.metadata || {};
          
          console.log('[SONG PAYMENT] Verified:', txStatus, metadata);
          
          if (['failed', 'cancelled', 'canceled', 'expired', 'declined'].includes(txStatus)) {
            showToast('Le paiement de la chanson a échoué.', 'error');
            creditPaymentProcessedRef.current = false;
          } else {
            // Créditer les extraCredits si applicable
            const extraCredits = parseInt(metadata.extraCredits, 10) || 0;
            if (extraCredits > 0 && metadata.userId) {
              supabase.auth.getSession().then((sessionData) => {
                const token = sessionData.data.session?.access_token || '';
                fetch('/api/moneroo/credit', {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ transactionId: paymentId })
                }).catch(err => console.warn('[SONG EXTRA CREDITS] Error:', err));
              });
            }
            
            // Stocker les metadata dans l'état React pour restaurer le Wizard sans localStorage/sessionStorage
            setRecoveredSongMetadata(metadata);
          }
          
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch(err => {
          console.error('[SONG PAYMENT VERIFY ERROR]', err);
          creditPaymentProcessedRef.current = false;
        });
      }
    } else if (paymentStatus === 'verify_song') {
      // Pas de paymentId → juste naviguer vers le wizard
      navigate('/create');
      navigate('/dashboard');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user]);

  const { showToast } = useToast();
  const { lang, setLang } = useTranslation();
  
  const [orders, setOrders] = useState<Song[]>([]);

  useEffect(() => {
    d1Database.getSongs().then((savedSongs: Song[]) => {
      if (savedSongs && savedSongs.length > 0) {
        setOrders(savedSongs);
      }
    });
  }, []);

  const [orderDraft, setOrderDraft] = useState<Partial<Song> | null>(null);
    const [recoveredSongMetadata, setRecoveredSongMetadata] = useState<any>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
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



  const handleOpenWizard = () => {
    if (!user) {
      setAuthMode('login');
      setIntent('wizard');
      setShowAuthModal(true);
      return;
    }
    navigate('/create');
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

  
  
  const handleLogout = () => {
    authRepository.logout();
    setUser(null);
    navigate('/');
    setIsPlaying(false);
    navigate('/');
    sessionStorage.removeItem('sonorya_app_view');
  };

  // Auto-redirect to dashboard/admin if just logged in via OAuth
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (location.pathname === '/' && sessionStorage.getItem('sonorya_oauth_pending') === 'true') {
        sessionStorage.removeItem('sonorya_oauth_pending');
        navigate('/dashboard');
      }
    }
  }, [user, location.pathname, navigate]);


  // Render routing
  return (
    <div className="app-root">
      <AnimatedBackground />
      
      <Routes>
        <Route path="/admin" element={
          user?.role === 'admin' ? (
            <AdminDashboard user={user} onLogout={handleLogout} onBackToLanding={() => navigate('/')} />
          ) : (
            <Navigate to="/" replace />
          )
        } />

        <Route path="/dashboard" element={
          user ? (
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
              initialView="home"
              onBackToLanding={() => navigate('/')}
              onOpenRechargeCredits={() => setShowCreditModal(true)}
              recoveredSongMetadata={recoveredSongMetadata}
              onClearRecoveredMetadata={() => setRecoveredSongMetadata(null)}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } />

        <Route path="/create" element={
          user ? (
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
              initialView="create"
              onBackToLanding={() => navigate('/')}
              onOpenRechargeCredits={() => setShowCreditModal(true)}
              recoveredSongMetadata={recoveredSongMetadata}
              onClearRecoveredMetadata={() => setRecoveredSongMetadata(null)}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } />

        <Route path="/*" element={
          <div className="landing-layout">
            <IzimeloHeader
              user={user}
              onOpenCreate={handleOpenWizard}
              onOpenLogin={() => {
                if (user) {
                  navigate(user.role === 'admin' ? '/admin' : '/dashboard');
                } else {
                  setAuthMode('login');
                  setIntent(null);
                  setShowAuthModal(true);
                }
              }}
              onGoToDashboard={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}
              onOpenRechargeCredits={() => setShowCreditModal(true)}
            />

            <main>
              <Routes>
                <Route path="/" element={
                  <>
                    <IzimeloHero onOpenCreate={handleOpenWizard} />
                    <OccasionsTicker />
                    <IzimeloHowItWorks />
                    <IzimeloDemos />
                    <IzimeloCoverFlow />
                    <IzimeloTestimonials />
                    <IzimeloFAQ />
                    <IzimeloPricing
                      onOpenCreate={handleOpenWizard}
                      onSelectPlan={() => {
                        if (!user) {
                          setAuthMode('signup');
                          setShowAuthModal(true);
                        } else {
                          setShowCreditModal(true);
                        }
                      }}
                    />
                  </>
                } />
                <Route path="/contact" element={<ContactPage onBack={() => navigate('/')} />} />
                <Route path="/terms" element={<LegalPage type="terms" onBack={() => navigate('/')} />} />
                <Route path="/privacy" element={<LegalPage type="privacy" onBack={() => navigate('/')} />} />
              </Routes>
            </main>

            <LandingFooter onNavigate={(view) => navigate(view === 'home' ? '/' : `/${view}`)} onOpenCreate={handleOpenWizard} />
          </div>
        } />
      </Routes>

      {/* Modals... */}
      {showCreditModal && (
        <CreditPurchaseModal
          user={user}
          onClose={() => setShowCreditModal(false)}
          onSuccess={(updatedUser) => setUser(updatedUser)}
          onOpenLogin={() => {
            setAuthMode('login');
            setShowAuthModal(true);
          }}
        />
      )}

      {showPreviewModal && orderDraft && (
        <AudioPreviewModal
          orderDraft={orderDraft}
          onClose={() => setShowPreviewModal(false)}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {showPaymentModal && orderDraft && (
        <PaymentModal
          orderDraft={orderDraft}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {showHistoryModal && (
        <OrderHistoryModal
          orders={orders}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={(loggedInUser) => {
            setShowAuthModal(false);
            setUser(loggedInUser);
            navigate(loggedInUser.role === 'admin' ? '/admin' : '/dashboard');
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
              navigate('/admin');
            } else {
              navigate(intent === 'wizard' ? '/create' : '/dashboard');
              setIntent(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default App;
