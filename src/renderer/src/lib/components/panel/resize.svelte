<script lang="ts">
	import { getSpaceConfig } from '$lib/runes/space-config.svelte';
	import NumberInput from '../ui/number-input.svelte';
	import Fieldset from './fieldset.svelte';
	import { _ } from 'svelte-i18n';

	const spaceConfig = getSpaceConfig();

	const width = $derived.by(() => {
		const value = spaceConfig.formData?.width;
		return typeof value === 'number' ? value.toString() : '';
	});
	const height = $derived.by(() => {
		const value = spaceConfig.formData?.height;
		return typeof value === 'number' ? value.toString() : '';
	});

	const transformValue = (value: number) => {
		if (Object.is(value, Number.NaN)) return undefined;
		return value < 1 ? undefined : value;
	};
</script>

<Fieldset legend={$_('resize')} class="flex flex-col gap-2">
	<NumberInput
		label={$_('width')}
		inputClass=""
		class="w-28"
		value={width}
		placeholder={$_('auto')}
		onValueChange={({ valueAsNumber }) => {
			spaceConfig.update('width', transformValue(valueAsNumber));
		}}
	/>
	<NumberInput
		label={$_('height')}
		inputClass=""
		class="w-28"
		value={height}
		placeholder={$_('auto')}
		onValueChange={({ valueAsNumber }) => {
			spaceConfig.update('height', transformValue(valueAsNumber));
		}}
	/>
</Fieldset>
