<script lang="ts">
	import { lang, getSystemLanguage } from '$lib/stores/lang';
	import { locale, _ } from 'svelte-i18n';
	import langOptions from '$lib/translations/lang.json';
	import type { Language } from '$lib/stores/lang';

	const items = Object.entries(langOptions).map(([value, label]) => ({
		value,
		label
	}));

	let open = false;

	$: {
		if ($lang === 'auto') {
			$locale = getSystemLanguage();
		} else {
			$locale = $lang;
		}
	}

	function selectLang(value: string) {
		lang.set(value as Language);
		open = false;
	}
</script>

<div class="flex items-center justify-between language-dropdown">
	<span class="font-medium">{$_('language')}</span>
	<div style="min-width:100px; width: 120px;">
		<button
			class="language-dropdown-btn"
			on:click={() => (open = !open)}
			type="button"
			aria-haspopup="listbox"
			aria-expanded={open}
		>
			<span class="mr-auto">{items.find((i) => i.value === $lang)?.label ?? $lang}</span>
			<svg class="language-dropdown-arrow" width="16" height="16" viewBox="0 0 16 16"
				><path
					d="M4 6l4 4 4-4"
					stroke="currentColor"
					stroke-width="1.5"
					fill="none"
					stroke-linecap="round"
				/></svg
			>
		</button>
		{#if open}
			<div class="language-dropdown-list" role="listbox">
				{#each items as item, i}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div
						class="language-dropdown-item {item.value === $lang ? 'active' : ''}"
						role="option"
						tabindex={i}
						aria-selected={item.value === $lang}
						on:click={() => selectLang(item.value)}
					>
						<span>{item.label}</span>
						{#if item.value === $lang}
							<svg class="language-dropdown-check" width="16" height="16" viewBox="0 0 16 16"
								><path
									d="M4 8l3 3 5-5"
									stroke="currentColor"
									stroke-width="1.5"
									fill="none"
									stroke-linecap="round"
								/></svg
							>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.language-dropdown {
		position: relative;
		min-width: 96px;
	}
	.language-dropdown-btn {
		display: flex;
		align-items: center;
		width: 100%;
		height: 28px;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		background: #fff;
		padding: 0 8px;
		font-size: 1rem;
		cursor: pointer;
		outline: none;
		transition: border 0.2s;
	}
	.language-dropdown-btn:focus {
		outline: 1px solid #a3a3a3;
	}
	.language-dropdown-arrow {
		margin-left: 4px;
		flex-shrink: 0;
	}
	.language-dropdown-list {
		position: absolute;
		top: 110%;
		left: 0;
		width: 100%;
		min-width: 90px;
		border: 1px solid #e5e7eb;
		background: #fafafa;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		padding: 4px 0;
		z-index: 9999;
		overflow: hidden;
	}
	.language-dropdown-item {
		display: flex;
		align-items: center;
		height: 28px;
		padding: 0 8px;
		margin: 4px;
		font-size: 1rem;
		border-radius: 6px;
		cursor: pointer;
		transition: background 0.15s;
	}
	.language-dropdown-item.active,
	.language-dropdown-item:hover {
		background: #e5e7eb;
	}
	.language-dropdown-check {
		margin-left: auto;
		color: #222;
	}
</style>
