import { client } from '$lib/client';
import { defaultSpaceStore, spaceStore } from '$lib/stores/space';
import { useStore } from '@tanstack/svelte-store';

/**
 * DragFile 类用于处理拖拽文件到界面时的相关事件
 * 支持多空间，自动归属到当前选中空间
 */
export class DragFile {
	// 当前选中的空间ID
	private spaceId = useStore(defaultSpaceStore);
	// 所有空间列表
	private spaces = useStore(spaceStore);

	// 当前空间对象，响应式获取
	private space = $derived.by(() => {
		return this.spaces.current.find((element) => element.id === this.spaceId.current);
	});

	/**
	 * 拖拽经过时阻止默认行为，允许放置
	 * @param e 拖拽事件
	 */
	ondragover = (e: DragEvent) => e.preventDefault();

	/**
	 * 拖拽释放时处理文件，批量导入到当前空间
	 * @param e 拖拽事件
	 */
	ondrop = (e: DragEvent) => {
		if (!this.space) return;
		e.preventDefault();
		e.stopPropagation();

		const files = e.dataTransfer?.files ?? [];
		const directory: string[] = [];
		for (let i = 0; i < files.length; i++) {
			// 获取文件的真实路径（兼容 Electron）
			const path = window.pixzip.getPathForFile(files[i]);
			directory.push(path);
		}
		// 调用主流程 scan，自动加入任务并压缩
		client.scan({ directory });
	};
}
