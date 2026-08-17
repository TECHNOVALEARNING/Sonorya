import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { fr } from '../../i18n/translations/fr';
import { en } from '../../i18n/translations/en';

export const IzimeloTestimonials: React.FC = () => {
  const { t, lang } = useTranslation();
  const tBase = lang === 'FR' ? fr.testimonials : en.testimonials;

  const reviewsData = [
    {
      id: 'rev-1',
      author: ' Cédric T.',
      rating: 5,
      text: tBase.items[0].text,
      occasion: tBase.items[0].occasion
    },
    {
      id: 'rev-2',
      author: 'Sophia M.',
      rating: 5,
      text: tBase.items[1].text,
      occasion: tBase.items[1].occasion
    },
    {
      id: 'rev-3',
      author: 'John B.',
      rating: 5,
      text: tBase.items[2].text,
      occasion: tBase.items[2].occasion
    }
  ];

  return (
    <section className="wrap" id="reviews" style={{ textAlign: 'center', padding: '60px 24px 80px' }}>
      <h2 style={{ fontSize: 36, marginBottom: 8 }}>
        {t('testimonials.title')} <span style={{ color: 'var(--coral)' }}>{t('testimonials.titleHighlight')}</span>
      </h2>
      <p style={{ color: 'var(--ivory-dim)', fontSize: 15, marginBottom: 40 }}>
        {t('testimonials.subtitle')}
      </p>

      <div className="izimelo-testi-grid">
        {reviewsData.map((r) => (
          <div key={r.id} className="izimelo-testi-card">
            <div>
              <p style={{ fontSize: 18, lineHeight: 1.5, color: 'var(--ivory)', fontStyle: 'italic', textAlign: 'left', marginBottom: 24, fontWeight: 300 }}>
                {r.text}
              </p>
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ivory)' }}>— {r.author}</div>
              <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.4)', marginTop: 4 }}>{r.occasion}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
