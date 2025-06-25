import { get } from 'svelte/store';
import { locale } from 'svelte-i18n';
import en from '../translations/en/common.json';
import zhCN from '../translations/zh-CN/common.json';
import zhTW from '../translations/zh-TW/common.json';

const translations = {
  'en': en,
  'zh-CN': zhCN,
  'zh-TW': zhTW
};

export function getTranslation(key: string): string {
  const currentLocale = get(locale);
  const translation = translations[currentLocale as keyof typeof translations] || translations.en;
  return translation[key as keyof typeof translation] || key;
} 