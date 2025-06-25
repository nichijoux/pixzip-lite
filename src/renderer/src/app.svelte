<script lang="ts">
	// 导入主界面所需的 Svelte 组件和工具函数
	import TitleBar from '$lib/components/title-bar/title-bar.svelte';
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';
	import { cn } from '$lib/shared/utils';
	import Panel from '$lib/components/panel/panel.svelte';
	import Stage from '$lib/components/stage/stage.svelte';
	import { Scan } from '$lib/runes/scan.svelte';
	import { TaskScheduler } from '$lib/runes/task-scheduler.svelte';
	import { theme } from '$lib/stores/theme';
	import { handlers } from '$lib/client';
	import { onMount } from 'svelte';
	import { addPasteImageTask } from '$lib/stores/task';
	import { useStore } from '@tanstack/svelte-store';
	import { defaultSpaceStore } from '$lib/stores/space';

	// 获取当前空间ID的 store，用于后续粘贴图片归属
	const spaceStore = useStore(defaultSpaceStore);

	// 初始化扫描和任务调度器（用于自动处理文件/图片任务）
	new Scan();
	new TaskScheduler();

	/**
	 * Svelte 生命周期钩子：组件挂载时执行
	 * 1. 监听主题变化，自动切换暗色/亮色
	 * 2. 监听全局粘贴事件，实现图片粘贴导入
	 * 3. 组件卸载时移除事件监听
	 */
	onMount(() => {
		// 监听主题变化，自动切换暗色/亮色
		const unsub = handlers.updateTheme.listen((isDark) => {
			if ($theme === 'system') {
				document.documentElement.classList.toggle('dark', isDark);
			}
		});

		/**
		 * 粘贴图片事件监听
		 * 1. 监听全局 paste 事件
		 * 2. 检查剪贴板内容是否包含图片
		 * 3. 读取图片为 base64，收集到 images 数组
		 * 4. 全部图片读取完毕后，调用 addPasteImageTask 进行保存和自动压缩
		 *
		 * @param {ClipboardEvent} e - 粘贴事件对象
		 */
		const handlePaste = (e: ClipboardEvent) => {
			const items = e.clipboardData?.items;
			if (!items) return;
			// 用于收集所有粘贴的图片信息
			const images: { base64: string; ext: string; size: number }[] = [];
			// 记录还有多少图片未读取完成
			let pending = 0;
			// 获取当前空间ID，图片将归属到该空间
			const spaceId = spaceStore.current;
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				// 只处理图片类型的剪贴板内容
				if (item.kind === 'file' && item.type.startsWith('image/')) {
					const file = item.getAsFile();
					if (file) {
						pending++;
						const reader = new FileReader();
						/**
						 * FileReader 读取图片为 base64
						 * 读取完成后将图片信息加入 images 数组
						 * 当所有图片都读取完毕后，调用 addPasteImageTask 进行后续处理
						 *
						 * @param {ProgressEvent<FileReader>} ev - 读取完成事件
						 */
						reader.onload = async (ev: ProgressEvent<FileReader>) => {
							images.push({
								base64: ev.target?.result as string,
								ext: file.type.split('/')[1] || 'png',
								size: file.size
							});
							pending--;
							// 所有图片都读取完毕后，统一处理
							if (pending === 0 && images.length > 0) {
								if (spaceId) await addPasteImageTask(spaceId, images);
							}
						};
						// 以 base64 方式读取图片
						reader.readAsDataURL(file);
					}
				}
			}
			// 如果有图片，阻止默认粘贴行为（如粘贴到输入框）
			if (images.length > 0) e.preventDefault();
		};
		// 绑定全局粘贴事件
		window.addEventListener('paste', handlePaste);

		// 组件卸载时移除事件监听，防止内存泄漏
		return () => {
			unsub();
			window.removeEventListener('paste', handlePaste);
		};
	});

	// 响应式：非系统主题时，手动切换 dark class
	$: {
		if ($theme !== 'system') {
			document.documentElement.classList.toggle('dark', $theme === 'dark');
		}
	}
</script>

<div class="h-screen flex overflow-hidden text-neutral-900 dark:text-neutral-300 text-sm">
	<Sidebar />

	<div
		class="grow flex border-l border-neutral-900/10 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-800"
	>
		<section class="w-[clamp(var(--w-config-min),16vw,var(--w-config-max))] shrink-0 flex flex-col">
			<Panel />
		</section>

		<div
			class={cn(
				'overflow-hidden grow flex flex-col border-l border-neutral-200 dark:border-neutral-100/10',
				{}
			)}
		>
			<TitleBar />

			<section class="grow flex flex-col overflow-y-auto">
				<Stage />
			</section>
		</div>
	</div>
</div>
