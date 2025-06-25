import { writable } from 'svelte/store';

export type Language = 'auto' | 'zh-CN' | 'zh-TW' | 'en';

export const lang = writable<Language>('auto');

export function getSystemLanguage(): Language {
  const userLanguage = navigator.language;
  
  if (userLanguage.startsWith('zh')) {
    if (userLanguage.includes('TW') || userLanguage.includes('HK')) {
      return 'zh-TW';
    }
    return 'zh-CN';
  }
  
  return 'en';
} 