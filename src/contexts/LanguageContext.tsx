'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { Language, BilingualText } from '@/types/content';

interface LanguageContextType {
  currentLang: Language;
  setLang: (lang: Language) => void;
  t: (text: BilingualText) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem('language') as Language | null;
    if (stored && (stored === 'en' || stored === 'es')) {
      setCurrentLang(stored);
    }
  }, []);

  const setLang = (lang: Language) => {
    setCurrentLang(lang);
    if (isClient) {
      localStorage.setItem('language', lang);
    }
  };

  const t = (text: BilingualText): string => {
    return text[currentLang];
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
