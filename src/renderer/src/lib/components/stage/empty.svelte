<script>
	import { Coffee } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
</script>

<div class="grow flex flex-col items-center justify-center">
	<Coffee size={48} class="text-neutral-500" />
	<p>{$_('dragHint')}</p>
	<p>{$_('supportedFormats')} <strong>JPG / PNG / GIF / WebP / AVIF</strong></p>
</div>
