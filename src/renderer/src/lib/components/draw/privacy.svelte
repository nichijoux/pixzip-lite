<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<div
	class="bg-sky-300 text-neutral-900 p-4 rounded-md shadow dark:bg-sky-900/20 dark:text-neutral-100"
>
	<h2 class="text-lg font-black mb-1">{$_('privacy')}</h2>
	<p>
		{$_('privacyDesc')}
	</p>
</div>
