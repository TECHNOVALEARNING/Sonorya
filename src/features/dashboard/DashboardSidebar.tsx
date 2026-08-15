import React from 'react';
import { Home, Compass, PlusCircle, Library, Heart, Disc, Settings, LogOut, User, X } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

import { UserProfile } from '../../types/melodia';

interface SidebarProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onOpenCreate: () => void;
  currentView: string;
  onBackToLanding?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  user?: UserProfile | null;
  onOpenRechargeCredits?: () => void;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ 
  onNavigate, 
  onLogout, 
  onOpenCreate, 
  currentView, 
  onBackToLanding,
  isOpen = false,
  onClose,
  user,
  onOpenRechargeCredits
}) => {
  const { t } = useTranslation();

  const handleItemClick = (view: string, action?: () => void) => {
    onNavigate(view);
    if (action) action();
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="dashboard-sidebar-overlay"
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 998,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      <aside 
        className={`dashboard-sidebar client-sidebar ${isOpen ? 'mobile-open' : ''}`}
      >
        <div 
          style={{ 
            fontFamily: 'Fraunces, serif', 
            fontSize: 22, 
            fontWeight: 700, 
            color: 'var(--ivory)', 
            marginBottom: 24, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between'
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: onBackToLanding ? 'pointer' : 'default' }}
            onClick={() => {
              if (onBackToLanding) onBackToLanding();
              if (onClose) onClose();
            }}
            title="Retour à l'accueil"
          >
            <img src="/images/sonorya-app-logo.png" alt="Sonorya Logo" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
            <span>Sonorya<span style={{ color: 'var(--coral)' }}>.</span></span>
            <span style={{ fontSize: 10, background: 'rgba(45,212,191,0.15)', color: 'var(--gold)', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>Client</span>
          </div>

          {/* Close button on mobile */}
          {onClose && (
            <button 
              className="mobile-sidebar-close"
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--ivory)',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'none', // Shown in CSS on mobile
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Credit Balance Card (Desktop & Mobile) */}
        <div 
          style={{ 
            margin: '0 0 20px',
            padding: '12px 14px', 
            background: 'linear-gradient(135deg, rgba(212, 161, 57, 0.14) 0%, rgba(45, 212, 191, 0.08) 100%)',
            border: '1px solid rgba(212, 161, 57, 0.32)',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gold)' }}>
              ⚡ Mes Crédits
            </span>
            <span style={{ fontSize: 10, background: 'rgba(212, 161, 57, 0.25)', color: '#FCD34D', padding: '2px 6px', borderRadius: 99, fontWeight: 800 }}>
              SOLDE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 24, fontWeight: 900, fontFamily: 'Fraunces, serif', color: 'var(--ivory)', lineHeight: 1 }}>
              {(user?.songCredits || 0) + (user?.bonusCredits || 0)}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
              chanson{(user?.songCredits || 0) + (user?.bonusCredits || 0) > 1 ? 's' : ''} disponible{(user?.songCredits || 0) + (user?.bonusCredits || 0) > 1 ? 's' : ''}
            </span>
          </div>

          {onOpenRechargeCredits && (
            <button
              onClick={() => {
                if (onClose) onClose();
                onOpenRechargeCredits();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '7px 10px',
                background: 'linear-gradient(135deg, #F5B978 0%, #E89E53 100%)',
                color: '#090B10',
                border: 'none',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
                boxShadow: '0 4px 12px rgba(245, 185, 120, 0.25)'
              }}
            >
              <span>+ Recharger mes crédits</span>
            </button>
          )}
        </div>

        <div className="dashboard-sidebar-section">
          <div className="dashboard-sidebar-title">{t('sidebar.menu')}</div>
          <button 
            className={`dashboard-nav-item ${currentView === 'home' ? 'active' : ''}`} 
            onClick={() => handleItemClick('home')}
          >
            <Home size={18} /> {t('sidebar.home')}
          </button>
          <button 
            className={`dashboard-nav-item ${currentView === 'explore' ? 'active' : ''}`} 
            onClick={() => handleItemClick('explore')}
          >
            <Compass size={18} /> {t('sidebar.explore')}
          </button>
          <button 
            className={`dashboard-nav-item ${currentView === 'create' ? 'active' : ''}`} 
            style={{ color: currentView === 'create' ? 'var(--gold-light)' : 'var(--gold)' }} 
            onClick={() => handleItemClick('create', onOpenCreate)}
          >
            <PlusCircle size={18} /> {t('sidebar.create')}
          </button>
        </div>

        <div className="dashboard-sidebar-section">
          <div className="dashboard-sidebar-title">{t('sidebar.library')}</div>
          <button 
            className={`dashboard-nav-item ${currentView === 'recent' ? 'active' : ''}`} 
            onClick={() => handleItemClick('recent')}
          >
            <Library size={18} /> {t('sidebar.recent')}
          </button>
          <button 
            className={`dashboard-nav-item ${currentView === 'favorites' ? 'active' : ''}`} 
            onClick={() => handleItemClick('favorites')}
          >
            <Heart size={18} /> {t('sidebar.favorites')}
          </button>
          <button 
            className={`dashboard-nav-item ${currentView === 'albums' ? 'active' : ''}`} 
            onClick={() => handleItemClick('albums')}
          >
            <Disc size={18} /> {t('sidebar.albums')}
          </button>
        </div>

        <div style={{ flex: 1, minHeight: 20 }} />

        <div className="dashboard-sidebar-section" style={{ marginBottom: 0, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button 
            className={`dashboard-nav-item ${currentView === 'profile' ? 'active' : ''}`} 
            onClick={() => handleItemClick('profile')}
          >
            <User size={18} /> {t('sidebar.profile')}
          </button>
          <button 
            className={`dashboard-nav-item ${currentView === 'settings' ? 'active' : ''}`} 
            onClick={() => handleItemClick('settings')}
          >
            <Settings size={18} /> {t('sidebar.settings')}
          </button>
          <button 
            className="dashboard-nav-item" 
            style={{ color: '#FF6B5B', background: 'rgba(255,107,91,0.12)', border: '1px solid rgba(255,107,91,0.3)', marginTop: 8, borderRadius: 10, fontWeight: 700 }} 
            onClick={() => {
              if (onClose) onClose();
              onLogout();
            }}
          >
            <LogOut size={18} /> {t('sidebar.logout')}
          </button>
        </div>
      </aside>
    </>
  );
};
