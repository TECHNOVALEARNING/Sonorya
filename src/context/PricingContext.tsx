import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'XOF' | 'EUR' | 'USD';

export interface PriceDetails {
  amount: number;
  formatted: string;
  currency: Currency;
}

interface PricingContextType {
  currency: Currency;
  countryCode: string | null;
  isLoading: boolean;
  getPrice: (baseXof: number) => PriceDetails;
}

const PricingContext = createContext<PricingContextType>({
  currency: 'XOF',
  countryCode: null,
  isLoading: true,
  getPrice: (baseXof) => ({ amount: baseXof, formatted: `${baseXof.toLocaleString('fr-FR')} FCFA`, currency: 'XOF' }),
});

const AFRICAN_COUNTRIES = ['BJ', 'CI', 'SN', 'ML', 'TG', 'BF', 'NE', 'CM', 'GA', 'CG', 'TD', 'CF', 'GQ', 'CD', 'GN'];
const EUROPEAN_COUNTRIES = ['FR', 'BE', 'LU', 'MC', 'AD', 'IT', 'ES', 'PT', 'DE', 'AT', 'NL', 'IE', 'FI', 'GR', 'EE', 'LV', 'LT', 'SK', 'SI', 'MT', 'CY', 'CH', 'GB'];

export const PricingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('XOF');
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We fetch in real-time on every session load.
    // Using sessionStorage just to prevent rate limit if the user reloads multiple times in the same tab.
    const fetchGeo = async () => {
      try {
        const cached = sessionStorage.getItem('sonorya_geocountry');
        if (cached) {
          applyCountry(cached);
          setIsLoading(false);
          return;
        }

        const res = await fetch('https://get.geojs.io/v1/ip/country.json');
        if (res.ok) {
          const data = await res.json();
          const country = data.country; // e.g. "FR"
          sessionStorage.setItem('sonorya_geocountry', country);
          applyCountry(country);
        }
      } catch (e) {
        console.error('Geo IP failed, defaulting to XOF', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeo();
  }, []);

  const applyCountry = (code: string) => {
    setCountryCode(code);
    if (AFRICAN_COUNTRIES.includes(code)) {
      setCurrency('XOF');
    } else if (EUROPEAN_COUNTRIES.includes(code)) {
      setCurrency('EUR');
    } else {
      setCurrency('USD');
    }
  };

  const getPrice = (baseXof: number): PriceDetails => {
    if (currency === 'EUR') {
      let amount = 3.99;
      if (baseXof === 1999) amount = 3.99;
      else if (baseXof === 2500) amount = 4.99;
      else if (baseXof === 2999) amount = 5.99;
      else if (baseXof === 3500) amount = 6.99;
      else if (baseXof === 4000) amount = 7.99;
      else if (baseXof === 7999) amount = 12.99;
      else {
        amount = Math.floor(baseXof / 655) + 0.99;
      }
      return { amount, formatted: `${amount.toFixed(2).replace('.', ',')} €`, currency };
    }
    
    if (currency === 'USD') {
      let amount = 4.99;
      if (baseXof === 1999) amount = 4.99;
      else if (baseXof === 2500) amount = 5.99;
      else if (baseXof === 2999) amount = 6.99;
      else if (baseXof === 3500) amount = 7.99;
      else if (baseXof === 4000) amount = 8.99;
      else if (baseXof === 7999) amount = 14.99;
      else {
        amount = Math.floor(baseXof / 600) + 0.99;
      }
      return { amount, formatted: `$${amount.toFixed(2)}`, currency };
    }

    // Default XOF
    return { amount: baseXof, formatted: `${baseXof.toLocaleString('fr-FR')} FCFA`, currency };
  };

  return (
    <PricingContext.Provider value={{ currency, countryCode, isLoading, getPrice }}>
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = () => useContext(PricingContext);
