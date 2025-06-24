import { client } from '$lib/client';
import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'pixzip-theme';

function get_theme(): Theme {
	if (typeof window === 'undefined') return 'system';
	return (localStorage.getItem(THEME_KEY) as Theme) || 'system';
}

const store = writable<Theme>(get_theme());

store.subscribe((current_theme) => {
	if (typeof window === 'undefined') return;

	if (current_theme === 'system') {
		client.theme_system();
	} else {
		client.theme_toggle({ theme: current_theme });
	}
});

export const theme = {
	subscribe: store.subscribe,
	set(new_theme: Theme) {
		localStorage.setItem(THEME_KEY, new_theme);
		store.set(new_theme);
	}
}; 