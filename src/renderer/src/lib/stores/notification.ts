// 通知设置相关的全局状态和方法
// 用于管理是否启用系统通知，并持久化到本地存储

import { writable } from 'svelte/store';
import { client } from '$lib/client';

/**
 * 通知设置对象类型
 * @property enabled 是否启用通知
 */
export interface NotificationSettings {
  enabled: boolean;
}

// 本地存储 key
const STORAGE_KEY = 'notification-settings';
// 默认通知设置
const defaultSettings: NotificationSettings = { enabled: true };

/**
 * 从本地存储加载通知设置
 * @returns NotificationSettings 通知设置对象
 */
function loadSettings(): NotificationSettings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch (e) {}
  return defaultSettings;
}

/**
 * 将通知设置保存到本地存储
 * @param settings 通知设置对象
 */
function saveSettings(settings: NotificationSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {}
}

// Svelte store，响应式通知设置
const store = writable<NotificationSettings>(loadSettings());
// 每次设置变化时自动保存到本地
store.subscribe(saveSettings);

/**
 * 导出通知设置的订阅接口（只读）
 * 用于 Svelte 组件中 $notificationSettings 订阅
 */
export const notificationSettings = {
  subscribe: store.subscribe
};

/**
 * 设置是否启用通知，并同步到主进程和本地存储
 * @param enabled 是否启用通知
 */
export function setNotificationEnabled(enabled: boolean) {
  store.set({ enabled });
  client.setNotificationSettings({ enabled });
} 