import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { translations, type Locale, type TranslationKey } from './translations';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: TranslationKey;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('weeat-locale');
    return (saved === 'en' ? 'en' : 'es') as Locale;
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('weeat-locale', l);
  }, []);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: translations[locale],
  }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
