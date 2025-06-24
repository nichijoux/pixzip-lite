<script lang="ts">
	import { Sun, Moon, Laptop } from 'lucide-svelte';
	import { theme } from '$lib/stores/theme';
	import type { Theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let isOpen = false;

	const icons = {
		light: Sun,
		dark: Moon,
		system: Laptop
	};

	function change_theme(new_theme: Theme) {
		isOpen = false;
		if (document.startViewTransition) {
			document.startViewTransition(() => {
				theme.set(new_theme);
			});
		} else {
			theme.set(new_theme);
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.theme-switcher-container')) {
			isOpen = false;
		}
	}

	onMount(() => {
		window.addEventListener('click', handleClickOutside);
		return () => {
			window.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="relative theme-switcher-container">
	<button
		type="button"
		class="w-7 h-7 flex items-center justify-center transition hover:bg-neutral-900/10 dark:hover:bg-neutral-100/10 rounded active:scale-95"
		on:click={() => (isOpen = !isOpen)}
	>
		<svelte:component this={icons[$theme]} class="w-5 h-5" strokeWidth="1.5" />
	</button>
	{#if isOpen}
		<div
			transition:fly={{ y: -5, duration: 200 }}
			class="absolute bottom-full mb-2 w-32 left-0 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg p-1"
		>
			<button
				transition:fade
				class="w-full text-left px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2"
				on:click={() => change_theme('light')}
			>
				<Sun class="w-4 h-4" /> Light
			</button>
			<button
				transition:fade
				class="w-full text-left px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2"
				on:click={() => change_theme('dark')}
			>
				<Moon class="w-4 h-4" /> Dark
			</button>
			<button
				transition:fade
				class="w-full text-left px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2"
				on:click={() => change_theme('system')}
			>
				<Laptop class="w-4 h-4" /> System
			</button>
		</div>
	{/if}
</div>

<style>
	:global(html) {
		transition: background-color 0.3s, color 0.3s;
	}
</style>
