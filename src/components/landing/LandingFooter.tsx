import React from 'react';
import { Heart, Lock, Instagram, Facebook, Mail, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface LandingFooterProps {
  onNavigate?: (page: string) => void;
  onOpenCreate?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onNavigate, onOpenCreate }) => {
  const { t } = useTranslation();
  const handleNav = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (onNavigate) {
      window.scrollTo(0, 0);
      onNavigate(page);
    }
  };

  return (
    <footer style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 1000,
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(45, 212, 191, 0.3), transparent)'
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 600,
        height: 300,
        background: 'radial-gradient(ellipse at top, rgba(212, 161, 57, 0.05), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="wrap" style={{ position: 'relative', zIndex: 1, paddingTop: 60, paddingBottom: 24 }}>
        
        {/* Pre-footer CTA */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 60,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 24,
          padding: '48px 24px'
        }}>
          <h3 style={{ fontSize: 36, fontFamily: 'Fraunces, serif', fontWeight: 600, color: 'var(--ivory)', marginBottom: 16 }}>
            {t('footer.ctaTitle')}
          </h3>
          <p style={{ color: 'var(--ivory-dim)', fontSize: 16, marginBottom: 32, maxWidth: 650, margin: '0 auto 32px' }}>
            {t('footer.ctaSubtitle')}
          </p>
          <button className="btn-coral" onClick={onOpenCreate}>
            {t('footer.ctaButton')} <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
          
          <div style={{ paddingRight: 20, flex: '2 1 300px' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 700, color: 'var(--ivory)', marginBottom: 20 }}>
              Sonorya<span style={{ color: 'var(--gold)' }}>.</span>
            </div>
            <p style={{ color: 'var(--ivory-dim)', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
              {t('footer.desc')}
            </p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <a href="https://www.instagram.com/technova.learning?igsh=NGkwbjNocHUwMDE5" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ivory-dim)', transition: 'color 0.2s' }} title="Instagram"><Instagram size={20} /></a>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--ivory-dim)', transition: 'color 0.2s', display: 'inline-flex' }} title="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.887 2.895 2.895 0 0 1-2.892-2.887 2.895 2.895 0 0 1 2.892-2.887c.277 0 .543.042.795.116V9.414a6.315 6.315 0 0 0-.795-.05 6.337 6.337 0 0 0-6.337 6.334 6.337 6.337 0 0 0 6.337 6.334 6.337 6.337 0 0 0 6.334-6.334V8.349a8.17 8.17 0 0 0 4.772 1.522V6.432a4.815 4.815 0 0 1-1.000.254z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/share/18GYGMg9o8/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ivory-dim)', transition: 'color 0.2s' }} title="Facebook"><Facebook size={20} /></a>
            </div>
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ivory)', marginBottom: 24 }}>{t('footer.discover')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14 }}>
              <a href="#" onClick={(e) => { e.preventDefault(); if(onNavigate) { onNavigate('home'); setTimeout(() => document.getElementById('how')?.scrollIntoView({behavior:'smooth'}), 100); } else { document.getElementById('how')?.scrollIntoView({behavior:'smooth'}); } }} style={{ color: 'var(--ivory-dim)', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }}>{t('footer.howItWorks')}</a>
              <a href="#" onClick={(e) => { e.preventDefault(); if(onNavigate) { onNavigate('home'); setTimeout(() => document.getElementById('examples')?.scrollIntoView({behavior:'smooth'}), 100); } else { document.getElementById('examples')?.scrollIntoView({behavior:'smooth'}); } }} style={{ color: 'var(--ivory-dim)', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }}>{t('footer.examples')}</a>
              <a
                href="https://technovalearning.com/apps"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--gold-light)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'opacity 0.2s',
                  marginTop: 2
                }}
              >
                <span style={{ position: 'relative', display: 'inline-flex', width: 9, height: 9 }}>
                  <span className="pulse-dot-ping" style={{
                    position: 'absolute',
                    display: 'inline-flex',
                    height: '100%',
                    width: '100%',
                    borderRadius: '50%',
                    backgroundColor: 'var(--coral)',
                    opacity: 0.85
                  }} />
                  <span style={{
                    position: 'relative',
                    display: 'inline-flex',
                    borderRadius: '50%',
                    height: 9,
                    width: 9,
                    backgroundColor: 'var(--coral)',
                    boxShadow: '0 0 10px var(--coral)'
                  }} />
                </span>
                Technova Apps Store
              </a>
            </div>
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ivory)', marginBottom: 24 }}>{t('footer.legal')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14 }}>
              <a href="#" onClick={(e) => handleNav(e, 'terms')} style={{ color: 'var(--ivory-dim)', textDecoration: 'none', transition: 'color 0.2s' }}>{t('footer.terms')}</a>
              <a href="#" onClick={(e) => handleNav(e, 'privacy')} style={{ color: 'var(--ivory-dim)', textDecoration: 'none', transition: 'color 0.2s' }}>{t('footer.privacy')}</a>
            </div>
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ivory)', marginBottom: 24 }}>{t('footer.support')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14 }}>
              <a href="#" onClick={(e) => { e.preventDefault(); if(onNavigate) { onNavigate('home'); setTimeout(() => document.getElementById('faq')?.scrollIntoView({behavior:'smooth'}), 100); } else { document.getElementById('faq')?.scrollIntoView({behavior:'smooth'}); } }} style={{ color: 'var(--ivory-dim)', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }}>{t('footer.faq')}</a>
              <a href="#" onClick={(e) => handleNav(e, 'contact')} style={{ color: 'var(--ivory-dim)', textDecoration: 'none', transition: 'color 0.2s' }}>{t('footer.contact')}</a>
            </div>
          </div>
          
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
          paddingTop: 24,
          paddingBottom: 8,
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ivory-dim)', fontSize: 13 }}>
            <span>© {new Date().getFullYear()} Sonorya by Technova.</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ivory-dim)', fontSize: 12 }}>
            <Lock size={14} />
            <span>{t('footer.securePayments')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
