// 语言（多语言/国际化）设置的全局状态和方法
// 用于管理和切换应用界面语言

import { writable } from 'svelte/store';

/**
 * 支持的语言类型
 * 'auto'：自动检测，'zh-CN'：简体中文，'zh-TW'：繁体中文，'en'：英文
 */
export type Language = 'auto' | 'zh-CN' | 'zh-TW' | 'en';

// Svelte store，响应式语言设置，默认 'auto'（自动检测）
export const lang = writable<Language>('auto');

/**
 * 获取系统（浏览器）语言，自动判断中/英文及简繁体
 * @returns Language 检测到的语言类型
 */
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