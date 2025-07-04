<script lang="ts">
	import {
		Trash2,
		ImageMinus,
		Clipboard,
		SquareArrowOutUpRight,
		ArrowRight,
		ArrowDown,
		Loader,
		ArrowUp
	} from 'lucide-svelte';
	import { MenuContent, MenuItem, MenuRoot, MenuSeparator, MenuTrigger } from '../ui/context-menu';
	import { bytesToSize, cn, OS, savePercentage, thumbImg } from '$lib/shared/utils';
	import { client } from '$lib/client';
	import { removeTask } from '$lib/stores/task';
	import { useStore } from '@tanstack/svelte-store';
	import { defaultSpaceStore } from '$lib/stores/space';
	import { _ } from 'svelte-i18n';

	type Props = {
		file: FileTask;
	};

	const { file }: Props = $props();

	const extDict: Record<string, string> = {
		jpg: 'JPG',
		jpeg: 'JPEG',
		png: 'PNG',
		webp: 'WebP',
		avif: 'AVIF',
		bmp: 'BMP',
		gif: 'GIF'
	};

	const percent = $derived.by(() => {
		if (file.status === 'completed') {
			return savePercentage(file.fileSize, file.outSize);
		}
	});

	let isOpen = $state(false);

	const spaceId = useStore(defaultSpaceStore);
</script>

<section
	class={cn('p-1 px-2', {
		'bg-sky-100/80 dark:bg-sky-800/20': isOpen,
		'even:bg-neutral-100/80': !isOpen
	})}
>
	<MenuRoot
		onOpenChange={({ open }) => {
			isOpen = open;
		}}
		onSelect={({ value }) => {
			switch (value) {
				case 'show':
					client.revealWith({ filepath: file.outputPath });
					break;
				case 'copy':
					client.copyFile({ filepath: file.outputPath });
					break;
				case 'remove':
					if (!spaceId.current) return;
					removeTask({ spaceId: spaceId.current, filepath: file.filepath });
					break;
				case 'delete':
					if (!spaceId.current) return;
					client.trashFile({ filepath: file.outputPath });
					removeTask({ spaceId: spaceId.current, filepath: file.filepath });
					break;
			}
		}}
	>
		<MenuTrigger>
			{@render image()}
		</MenuTrigger>
		<MenuContent>
			<MenuItem value="show">
				<SquareArrowOutUpRight class="w-4 h-4 mr-2 text-neutral-500" />{$_('showInFolder')}
			</MenuItem>
			{#if OS !== 'linux'}
				<MenuItem value="copy">
					<Clipboard class="w-4 h-4 mr-2 text-neutral-500" />{$_('copy')}
				</MenuItem>
			{/if}
			<MenuItem value="remove">
				<ImageMinus class="w-4 h-4 mr-2 text-neutral-500" />{$_('remove')}
			</MenuItem>
			<MenuSeparator />
			<MenuItem value="delete" class="text-red-600">
				<Trash2 class="w-4 h-4 mr-2" />{$_('delete')}
			</MenuItem>
		</MenuContent>
	</MenuRoot>
</section>

{#snippet image()}
	<div class="flex items-center gap-2 text-xs">
		<div class="w-8 h-8 shrink-0 grid place-items-center">
			{#if file.outputPath && file.outputPath.startsWith('data:image/')}
				<img class="max-w-8 max-h-8 shadow" src={file.outputPath} alt="" />
			{:else}
				<img class="max-w-8 max-h-8 shadow" src={thumbImg(file.filepath)} alt="" />
			{/if}
		</div>
		<div class="grow w-20 min-w-0">
			<div class="truncate min-w-0">
				{file.filepath}
			</div>
			<section class="flex items-center gap-3">
				<div class="flex items-center gap-1">
					<small class="px-1 bg-neutral-800 text-white rounded font-bold"
						>{extDict[file.extname.toLowerCase()]}</small
					>
					<ArrowRight class="w-3" />
					<small class="px-1 bg-neutral-800 text-white rounded font-bold"
						>{extDict[file.targetExtname.toLowerCase()]}</small
					>
				</div>

				{#if file.status === 'completed'}
					<div class="flex items-center gap-1">
						<span>{bytesToSize(file.fileSize)}</span>
						<ArrowRight class="w-3 h-3" />
						<span>{bytesToSize(file.outSize)}</span>
					</div>

					<div
						class={cn('flex items-center border border-neutral-200 rounded px-1 text-white', {
							'bg-green-600/80': percent !== undefined && percent > 0,
							'bg-orange-600/80': percent !== undefined && percent < 0
						})}
					>
						{#if percent !== undefined && percent > 0}
							<ArrowDown class="w-3 h-3" />
						{:else if percent !== undefined && percent < 0}
							<ArrowUp class="w-3 h-3" />
						{/if}
						<span>{percent && Math.abs(percent)}%</span>
					</div>
				{:else if file.status === 'processing'}
					<Loader class="w-3 h-3 animate-spin" />
				{/if}
			</section>
		</div>
	</div>
{/snippet}
