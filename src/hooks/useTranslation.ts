'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import type { BilingualText, Language } from '@/types/content';

export function useTranslation() {
  const { currentLang, t } = useLanguage();

  return {
    t: (text: BilingualText): string => t(text),
    currentLang: currentLang as Language,
  };
}
