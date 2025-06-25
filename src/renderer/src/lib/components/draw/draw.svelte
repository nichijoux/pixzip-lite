<script lang="ts">
	import { Settings } from 'lucide-svelte';
	import { Drawer } from 'vaul-svelte';
	import Version from './version.svelte';
	import Donate from './donate.svelte';
	import Privacy from './privacy.svelte';
	import OpenSource from './open-source.svelte';
	import Language from './language.svelte';
	import { _ } from 'svelte-i18n';
</script>

<Drawer.Root>
	<Drawer.Trigger
		class="w-7 h-7 flex items-center justify-center transition hover:bg-neutral-900/10 dark:hover:bg-neutral-100/10 rounded active:scale-95"
	>
		<Settings class="w-4 h-4" />
	</Drawer.Trigger>

	<Drawer.Portal>
		<Drawer.Content class="fixed inset-x-0 bottom-0 z-50 ">
			<div
				class="max-h-[80vh] overflow-auto bg-neutral-50 dark:bg-neutral-800 p-5 text-sm rounded-t-[10px]"
			>
				<main class="grid grid-cols-2 max-w-lg mx-auto gap-5">
					<section class="flex flex-col gap-5">
						<div class="p-4 dark:bg-neutral-700 dark:text-neutral-100 rounded-md shadow">
							<h2 class="text-lg font-bold mb-3">{$_('settings')}</h2>
							<div class="flex flex-col gap-3">
								<Language />
							</div>
						</div>
						<Version />
						<Privacy />
					</section>
					<section class="flex flex-col gap-5">
						<Donate />
						<OpenSource />
					</section>
				</main>
			</div>
		</Drawer.Content>
		<Drawer.Overlay class="fixed inset-0 z-10 bg-black/80" />
	</Drawer.Portal>
</Drawer.Root>
