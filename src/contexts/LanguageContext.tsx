
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  translations: Record<string, string>;
}

const defaultContext: LanguageContextType = {
  currentLanguage: 'en',
  setLanguage: () => {},
  translations: {},
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Load translations based on selected language
  const loadTranslations = async (language: string) => {
    try {
      // In a real implementation, this would fetch from a translations file or API
      // For this demo, we'll use a simple object
      const translationsMap: Record<string, Record<string, string>> = {
        en: { welcome: 'Welcome', search: 'Search' },
        hi: { welcome: 'स्वागत है', search: 'खोज' },
        bn: { welcome: 'স্বাগতম', search: 'অনুসন্ধান' },
        te: { welcome: 'స్వాగతం', search: 'వెతకండి' },
        ta: { welcome: 'வரவேற்கிறோம்', search: 'தேடல்' },
        mr: { welcome: 'स्वागत आहे', search: 'शोध' },
        gu: { welcome: 'આપનું સ્વાગત છે', search: 'શોધ' },
        kn: { welcome: 'ಸ್ವಾಗತ', search: 'ಹುಡುಕು' },
        ml: { welcome: 'സ്വാഗതം', search: 'തിരയുക' },
        pa: { welcome: 'ਜੀ ਆਇਆਂ ਨੂੰ', search: 'ਖੋਜ' },
        or: { welcome: 'ସ୍ୱାଗତ', search: 'ସନ୍ଧାନ' },
      };

      setTranslations(translationsMap[language] || {});
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  };

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    loadTranslations(language);
    // You might also want to persist this choice to localStorage
    localStorage.setItem('preferredLanguage', language);
  };

  // Initialize with stored language preference or default
  React.useEffect(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage && ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa', 'or'].includes(storedLanguage)) {
      setLanguage(storedLanguage);
    } else {
      loadTranslations('en');
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};
