// 主题（明亮/暗色/跟随系统）设置的全局状态和方法
// 用于管理和切换应用主题，并持久化到本地存储

import { client } from '$lib/client';
import { writable } from 'svelte/store';

/**
 * 主题类型：'light' 明亮，'dark' 暗色，'system' 跟随系统
 */
export type Theme = 'light' | 'dark' | 'system';

// 本地存储 key
const THEME_KEY = 'pixzip-theme';

/**
 * 获取本地存储的主题设置
 * @returns Theme 当前主题
 */
function getTheme(): Theme {
	if (typeof window === 'undefined') return 'system';
	return (localStorage.getItem(THEME_KEY) as Theme) || 'system';
}

// Svelte store，响应式主题设置
const store = writable<Theme>(getTheme());

// 主题变化时，同步到主进程（用于原生窗口变色等）
store.subscribe((currentTheme) => {
	if (typeof window === 'undefined') return;

	if (currentTheme === 'system') {
		client.theme_system();
	} else {
		client.theme_toggle({ theme: currentTheme });
	}
});

/**
 * 导出主题设置的订阅和修改接口
 * 用于 Svelte 组件中 $theme 订阅和 set 切换主题
 */
export const theme = {
	subscribe: store.subscribe,
	set(newTheme: Theme) {
		localStorage.setItem(THEME_KEY, newTheme);
		store.set(newTheme);
	}
}; 