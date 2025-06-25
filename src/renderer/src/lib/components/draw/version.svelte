<script lang="ts">
	import { client } from '$lib/client';
	import { _ } from 'svelte-i18n';

	let version = $state('');
	client.getVersion().then((res) => {
		version = res;
	});

	const fetchVersion = async () => {
		const resp = await fetch('https://api.github.com/repos/richhost/pixzip-lite/releases/latest');
		const data = await resp.json();
		if (resp.ok) {
			return data.tag_name.replace('v', '');
		}
		throw new Error('Failed to fetch version');
	};
</script>

<div class="p-4 rounded-md bg-amber-200 text-neutral-900 shadow">
	<h2 class="font-bold text-lg mb-1">{$_('version')}</h2>

	<div>{$_('currentVersion')}: {version}</div>

	{#await fetchVersion()}
		<p>...{$_('waiting')}</p>
	{:then data}
		{#if data !== version}
			<p>{$_('Latest version')}: {data}</p>
			<a
				class="rounded-md flex items-center justify-center h-8 bg-neutral-900 font-medium text-white mt-2"
				href="https://github.com/richhost/pixzip-lite/releases"
				target="_blank"
				rel="noreferrer"
			>
				{$_('download')}
			</a>
		{:else}
			<div>{$_('noNewVersion')}</div>
		{/if}
	{:catch}
		<p class="text-red-500">{$_('fetchVersionFailed')}</p>
	{/await}
</div>
