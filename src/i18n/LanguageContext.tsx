import React, { createContext, useContext, useState, ReactNode } from 'react';
import { fr } from './translations/fr';
import { en } from './translations/en';

type Language = 'FR' | 'EN';
type Translations = typeof fr;

interface LanguageContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const dictionaries: Record<Language, Translations> = {
  FR: fr,
  EN: en
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('sonorya_lang');
      if (saved === 'EN' || saved === 'FR') return saved;
    } catch (e) {
      // ignore
    }
    return 'FR';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('sonorya_lang', newLang);
    } catch (e) {
      // ignore
    }
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = dictionaries[lang];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to key if not found
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value === 'string') {
      if (replacements) {
        return Object.entries(replacements).reduce((acc, [k, v]) => {
          return acc.replace(new RegExp(`{${k}}`, 'g'), String(v));
        }, value);
      }
      return value;
    }

    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
