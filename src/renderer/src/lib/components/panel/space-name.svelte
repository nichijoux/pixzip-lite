<script lang="ts">
	import { getSpaceConfig } from '$lib/runes/space-config.svelte';
	import Input from '../ui/input.svelte';
	import Fieldset from './fieldset.svelte';
	import { _ } from 'svelte-i18n';
	
	const spaceConfig = getSpaceConfig();

	const name = $derived(spaceConfig.formData?.name);
</script>

<Fieldset legend={$_('basic')}>
	<label class="flex items-center justify-between">
		<span class="font-medium">{$_('name')}</span>
		<Input
			class="w-28"
			value={name === 'Space' ? $_('space') : name}
			oninput={(e) => {
				spaceConfig.update('name', (e.target as HTMLInputElement).value);
			}}
			spellcheck={false}
		/>
	</label>
</Fieldset>
