<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<div class="rounded-md bg-[#ff5f5f0d] p-4 shadow">
	<h2 class="text-lg font-bold mb-1">{$_('donate')}</h2>
	<p>{$_('donateDesc')}</p>
	<a
		href="https://ko-fi.com/abieeyang"
		target="_blank"
		rel="noopener"
		class="bg-[#ff5f5f] flex items-center justify-center text-white h-8 rounded-md font-medium gap-1 mt-2 cursor-pointer"
	>
		<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
			><path
				fill="currentColor"
				d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734c4.352.24 7.422-2.831 6.649-6.916m-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09c-.443-.441-3.368-3.049-4.034-3.954c-.709-.965-1.041-2.7-.091-3.71c.951-1.01 3.005-1.086 4.363.407c0 0 1.565-1.782 3.468-.963s1.832 3.011.723 4.311m6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015"
			/></svg
		>
		Ko-fi
	</a>
</div>
