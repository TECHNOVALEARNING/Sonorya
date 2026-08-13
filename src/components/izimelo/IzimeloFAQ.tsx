import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { fr } from '../../i18n/translations/fr';
import { en } from '../../i18n/translations/en';

export const IzimeloFAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { t, lang } = useTranslation();
  const faqs = lang === 'FR' ? fr.faq.items : en.faq.items;

  return (
    <section className="wrap" id="faq" style={{ textAlign: 'center', padding: '60px 24px 100px' }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--coral)', margin: '0 auto 14px' }} />

      <h2 style={{ fontSize: 36, marginBottom: 8 }}>
        {t('faq.title')} <span style={{ color: 'var(--coral)' }}>{t('faq.titleHighlight')}</span>
      </h2>
      <p style={{ color: 'var(--ivory-dim)', fontSize: 15, marginBottom: 40 }}>
        {t('faq.subtitle')}
      </p>

      <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'left' }}>
        {faqs.map((f, i) => {
          const isOpen = openIdx === i;

          return (
            <div key={i} className="izimelo-faq-item">
              <div
                className="izimelo-faq-header"
                onClick={() => setOpenIdx(isOpen ? null : i)}
              >
                <span>{f.q}</span>
                <span style={{ color: 'var(--coral)', fontSize: 18, fontWeight: 700 }}>
                  {isOpen ? '−' : '+'}
                </span>
              </div>
              {isOpen && (
                <div className="izimelo-faq-body">
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
