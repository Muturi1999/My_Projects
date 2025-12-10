export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '/images/england-flag.png' },
  { code: 'nl', name: 'Dutch', flag: '/images/netherland-flag.png' },
  { code: 'ja', name: 'Japanese', flag: '/images/japan-flag.png' },
  { code: 'ko', name: 'Korean', flag: '/images/korea-flag.png' },
  { code: 'zh', name: 'Chinese', flag: '/images/china-flag.png' },
];

