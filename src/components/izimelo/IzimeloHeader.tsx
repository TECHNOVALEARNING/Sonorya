import React, { useState } from 'react';
import { ArrowRight, Globe, Menu, X, LayoutDashboard, User } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { UserProfile } from '../../types/melodia';

interface IzimeloHeaderProps {
  user: UserProfile | null;
  onOpenCreate: () => void;
  onOpenLogin: () => void;
  onGoToDashboard: () => void;
}

export const IzimeloHeader: React.FC<IzimeloHeaderProps> = ({
  user,
  onOpenCreate,
  onOpenLogin,
  onGoToDashboard
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useTranslation();

  return (
    <header className="izimelo-header">
      <div className="wrap header-inner">
        <a href="#" className="logo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/images/sonorya-app-logo.png" alt="Sonorya Logo" style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover' }} />
          <div>
            Son<span className="accent">o</span>rya <span style={{ fontSize: 13, color: 'var(--gold)' }}>by Technova</span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="izimelo-nav izimelo-nav-desktop">
          <a href="#examples">{t('header.examples')}</a>
          <a href="#library">{t('header.library')}</a>
          <a href="#how">{t('header.howItWorks')}</a>
          <a href="#reviews">{t('header.reviews')}</a>
          <a href="#faq">{t('header.faq')}</a>

          <button className="link-btn" onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')} style={{ fontSize: 13 }}>
            <Globe size={15} />
            <span>{lang}</span>
          </button>

          {user ? (
            <button 
              className="btn-coral" 
              onClick={onGoToDashboard}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, #2DD4BF, #0EA5E9)',
                boxShadow: '0 4px 16px rgba(45, 212, 191, 0.3)',
                padding: '10px 20px',
                borderRadius: 99
              }}
            >
              <LayoutDashboard size={16} />
              <span>{user.role === 'admin' ? 'Console Admin' : 'Mon Dashboard'}</span>
            </button>
          ) : (
            <button className="btn-coral" onClick={onOpenLogin}>
              <span>{t('header.login')}</span>
            </button>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button className="mobile-menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="mobile-nav-drawer">
          <a href="#examples" onClick={() => setMobileOpen(false)}>{t('header.examples')}</a>
          <a href="#library" onClick={() => setMobileOpen(false)}>{t('header.library')}</a>
          <a href="#how" onClick={() => setMobileOpen(false)}>{t('header.howItWorks')}</a>
          <a href="#reviews" onClick={() => setMobileOpen(false)}>{t('header.reviews')}</a>
          <a href="#faq" onClick={() => setMobileOpen(false)}>{t('header.faq')}</a>
          
          <button className="link-btn" onClick={() => { setLang(lang === 'FR' ? 'EN' : 'FR'); setMobileOpen(false); }}>
            <Globe size={15} />
            <span>{lang}</span>
          </button>

          {user ? (
            <button className="btn-coral" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { onGoToDashboard(); setMobileOpen(false); }}>
              <LayoutDashboard size={16} /> {user.role === 'admin' ? 'Console Admin' : 'Mon Dashboard'}
            </button>
          ) : (
            <button className="btn-coral" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { onOpenLogin(); setMobileOpen(false); }}>
              {t('header.login')}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
