
export const supportedLanguages = [
  { id: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { id: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { id: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { id: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { id: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { id: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { id: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { id: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { id: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { id: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' }
];

export const t = (key: string, translations: Record<string, string>, fallback?: string): string => {
  return translations[key] || fallback || key;
};
