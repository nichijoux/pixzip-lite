<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';

	const links = [
		{
			name: 'pixzip-lite',
			url: 'https://github.com/richhost/pixzip-lite'
		},
		{
			name: 'Svelte',
			url: 'https://github.com/sveltejs/svelte'
		},
		{
			name: 'zag',
			url: 'https://github.com/chakra-ui/zag'
		},
		{
			name: 'sharp',
			url: 'https://github.com/lovell/sharp'
		},
		{
			name: 'tipc',
			url: 'https://github.com/egoist/tipc'
		}
	];
</script>

<div class="p-4 rounded-md shadow bg-green-50 dark:bg-green-900/20">
	<h2 class="text-lg font-bold mb-1">{$_('openSource')}</h2>
	<p class="">
		{$_('openSourceDesc')}
	</p>
	<ul class="list-disc px-4 mt-2">
		{#each links as item}
			<li>
				<div class="flex items-center gap-0.5 cursor-pointer">
					<a href={item.url} target="_blank" rel="noreferrer">{item.name}</a>
					<ArrowUpRight class="w-4 h-4 mt-0.5" strokeWidth="1.5" />
				</div>
			</li>
		{/each}
	</ul>
</div>
