import React from 'react';
import { MessageSquare, Music, Download } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { fr } from '../../i18n/translations/fr';
import { en } from '../../i18n/translations/en';

export const IzimeloHowItWorks: React.FC = () => {
  const { t, lang } = useTranslation();
  const tBase = lang === 'FR' ? fr.howItWorks : en.howItWorks;
  
  const stepsData = [
    {
      icon: <MessageSquare size={28} />,
      number: '01',
      title: tBase.steps[0].title,
      desc: tBase.steps[0].desc
    },
    {
      icon: <Music size={28} />,
      number: '02',
      title: tBase.steps[1].title,
      desc: tBase.steps[1].desc
    },
    {
      icon: <Download size={28} />,
      number: '03',
      title: tBase.steps[2].title,
      desc: tBase.steps[2].desc
    }
  ];

  return (
    <section className="wrap" id="how" style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--coral)', margin: '0 auto 14px' }} />

      <h2 style={{ fontSize: 36, marginBottom: 8 }}>
        {t('howItWorks.title')} <span style={{ color: 'var(--coral)' }}>{t('howItWorks.titleHighlight')}</span>
      </h2>
      <p style={{ color: 'var(--ivory-dim)', fontSize: 15, marginBottom: 48 }}>
        {t('howItWorks.subtitle')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, textAlign: 'left' }}>
        {stepsData.map((s, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20,
            padding: '32px 28px',
            position: 'relative',
            transition: 'border-color 0.3s ease, transform 0.3s ease'
          }}
          className="how-step-card"
          >
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 56, height: 56, borderRadius: 16,
              background: 'rgba(212,161,57,0.1)', color: 'var(--gold)',
              marginBottom: 20
            }}>
              {s.icon}
            </div>
            <div style={{ fontSize: 12, color: 'var(--coral)', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 8 }}>
              {t('howItWorks.stepWord')} {s.number}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: 'var(--ivory)' }}>
              {s.title}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--ivory-dim)', lineHeight: 1.6 }}>
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
