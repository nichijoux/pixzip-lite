<script lang="ts">
	import Checkbox from '../ui/checkbox.svelte';
	import { notificationSettings, setNotificationEnabled } from '$lib/stores/notification';
	import { _ } from 'svelte-i18n';
</script>

<div class="mt-2 p-3 border border-neutral-200 dark:border-neutral-100/10 rounded">
	<label class="flex items-center gap-2">
		<Checkbox
			checked={$notificationSettings.enabled}
			onchange={(e) => setNotificationEnabled((e.target as HTMLInputElement).checked)}
		/>
		<span class="font-medium">{$_('enableNotifications')}</span>
	</label>
	<p class="text-xs text-right text-neutral-500 mt-1">
		{$_('notificationDesc')}
	</p>
</div>
