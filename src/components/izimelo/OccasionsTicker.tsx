import React from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { fr } from '../../i18n/translations/fr';
import { en } from '../../i18n/translations/en';

export const OccasionsTicker: React.FC = () => {
  const { lang } = useTranslation();
  const items = lang === 'FR' ? fr.occasions : en.occasions;

  return (
    <div className="ticker-container">
      <div className="ticker-track">
        {Array.from({ length: 4 }).flatMap(() => items).map((item, idx) => (
          <div key={idx} className="ticker-item">
            <span>{item}</span>
            <span className="accent-star">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
