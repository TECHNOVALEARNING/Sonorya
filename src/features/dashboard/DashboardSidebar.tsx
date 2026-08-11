import React from 'react';
import { Home, Compass, PlusCircle, Library, Heart, Disc, Settings, LogOut, User, Globe } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface SidebarProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onOpenCreate: () => void;
  currentView: string;
  onBackToLanding?: () => void;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ onNavigate, onLogout, onOpenCreate, currentView, onBackToLanding }) => {
  const { t } = useTranslation();
  return (
    <aside className="dashboard-sidebar client-sidebar" style={{ background: '#12141D', backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(45, 212, 191, 0.08) 0%, transparent 70%)', borderRight: '1px solid rgba(255,255,255,0.06)', width: 240, minWidth: 240, height: '100vh', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '24px 18px 28px', position: 'relative', zIndex: 2 }}>
      <div 
        style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 700, color: 'var(--ivory)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, cursor: onBackToLanding ? 'pointer' : 'default' }}
        onClick={() => onBackToLanding && onBackToLanding()}
        title="Retour à l'accueil"
      >
        <img src="/images/sonorya-app-logo.png" alt="Sonorya Logo" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
        Sonorya<span style={{ color: 'var(--coral)' }}>.</span>
        <span style={{ fontSize: 10, background: 'rgba(45,212,191,0.15)', color: 'var(--gold)', padding: '2px 8px', borderRadius: 99, fontWeight: 700, marginLeft: 'auto' }}>Client</span>
      </div>

      <div className="dashboard-sidebar-section">
        {/* <div className="dashboard-sidebar-title">{t('sidebar.menu')}</div>
        {onBackToLanding && (
          <button className="dashboard-nav-item" onClick={onBackToLanding} style={{ color: 'var(--ivory-dim)', marginBottom: 4 }}>
            <Globe size={18} /> Site Web (Accueil)
          </button>
        )} */}
        <button className={`dashboard-nav-item ${currentView === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
          <Home size={18} /> {t('sidebar.home')}
        </button>
        <button className={`dashboard-nav-item ${currentView === 'explore' ? 'active' : ''}`} onClick={() => onNavigate('explore')}>
          <Compass size={18} /> {t('sidebar.explore')}
        </button>
        <button className={`dashboard-nav-item ${currentView === 'create' ? 'active' : ''}`} style={{ color: currentView === 'create' ? 'var(--gold-light)' : 'var(--gold)' }} onClick={() => { onNavigate('create'); onOpenCreate(); }}>
          <PlusCircle size={18} /> {t('sidebar.create')}
        </button>
      </div>

      <div className="dashboard-sidebar-section">
        <div className="dashboard-sidebar-title">{t('sidebar.library')}</div>
        <button className={`dashboard-nav-item ${currentView === 'recent' ? 'active' : ''}`} onClick={() => onNavigate('recent')}>
          <Library size={18} /> {t('sidebar.recent')}
        </button>
        <button className={`dashboard-nav-item ${currentView === 'favorites' ? 'active' : ''}`} onClick={() => onNavigate('favorites')}>
          <Heart size={18} /> {t('sidebar.favorites')}
        </button>
        <button className={`dashboard-nav-item ${currentView === 'albums' ? 'active' : ''}`} onClick={() => onNavigate('albums')}>
          <Disc size={18} /> {t('sidebar.albums')}
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 20 }} />

      <div className="dashboard-sidebar-section" style={{ marginBottom: 0, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button className={`dashboard-nav-item ${currentView === 'profile' ? 'active' : ''}`} onClick={() => onNavigate('profile')}>
          <User size={18} /> {t('sidebar.profile')}
        </button>
        <button className={`dashboard-nav-item ${currentView === 'settings' ? 'active' : ''}`} onClick={() => onNavigate('settings')}>
          <Settings size={18} /> {t('sidebar.settings')}
        </button>
        <button className="dashboard-nav-item" style={{ color: '#FF6B5B', background: 'rgba(255,107,91,0.12)', border: '1px solid rgba(255,107,91,0.3)', marginTop: 8, borderRadius: 10, fontWeight: 700 }} onClick={onLogout}>
          <LogOut size={18} /> {t('sidebar.logout')}
        </button>
      </div>
    </aside>
  );
};
