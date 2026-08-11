import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { fr } from '../../i18n/translations/fr';
import { en } from '../../i18n/translations/en';

interface LegalPageProps {
  type: 'terms' | 'privacy';
  onBack: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onBack }) => {
  const { t, lang } = useTranslation();
  const tBase = lang === 'FR' ? fr.legal : en.legal;
  const isTerms = type === 'terms';
  
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 80px', minHeight: '80vh' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--coral)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, fontSize: 16, fontWeight: 600 }}>
        <ArrowLeft size={20} /> {t('contact.backToHome')}
      </button>

      <div style={{ marginBottom: 64 }}>
        <h1 style={{ fontSize: 40, fontWeight: 700, fontFamily: 'Fraunces, serif', marginBottom: 16, color: 'var(--ivory)' }}>
          {isTerms ? t('legal.termsTitle') : t('legal.privacyTitle')}
        </h1>
        <p style={{ color: 'var(--ivory-dim)', fontSize: 16 }}>
          {t('legal.lastUpdated')}
        </p>
      </div>

      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {isTerms ? (
          <>
            {tBase.termsSections.map((sec, idx) => (
              <section key={idx}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--ivory)', marginBottom: 16 }}>{sec.title}</h2>
                <p>{sec.content}</p>
              </section>
            ))}
          </>
        ) : (
          <>
            {tBase.privacySections.map((sec, idx) => (
              <section key={idx}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--ivory)', marginBottom: 16 }}>{sec.title}</h2>
                <p>{sec.content}</p>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
