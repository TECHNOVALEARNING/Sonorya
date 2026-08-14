import React from 'react';
import { Home, Compass, PlusCircle, Library, Heart, Disc, Settings, LogOut, User, X } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface SidebarProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onOpenCreate: () => void;
  currentView: string;
  onBackToLanding?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ 
  onNavigate, 
  onLogout, 
  onOpenCreate, 
  currentView, 
  onBackToLanding,
  isOpen = false,
  onClose
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
