// 任务状态管理模块（任务列表的增删查改、粘贴图片自动压缩等）
// 主要负责：
// 1. 维护任务列表的全局状态（每个空间有独立的任务列表）
// 2. 提供任务的添加、移除、清空等操作
// 3. 粘贴图片时自动保存并推送到压缩主流程

import { client } from '$lib/client';
import { Store } from '@tanstack/svelte-store';

// 任务全局状态类型：每个空间（spaceId）对应一个 FileTask 数组
// 例如：task = Map<spaceId, FileTask[]>
type TaskStore = {
	task: Map<string, FileTask[]>;
};

// Svelte 全局任务 store，所有任务都存储在这里
export const taskStore = new Store<TaskStore>({ task: new Map() });

// 移除任务参数类型
// spaceId: 空间ID，filepath: 文件路径
// 用于唯一定位要移除的任务
type RemoveTask = {
	spaceId: string;
	filepath: string;
};

/**
 * 从任务列表中移除指定任务
 *
 * @param {Object} params - 参数对象
 * @param {string} params.spaceId - 空间ID（任务分组）
 * @param {string} params.filepath - 文件路径（唯一定位任务）
 * @returns {void}
 */
export const removeTask = ({ spaceId, filepath }: RemoveTask): void => {
	taskStore.setState((prev) => {
		const taskMap = structuredClone(prev.task);
		const list = taskMap.get(spaceId) ?? [];
		const newList = list.filter((item) => item.filepath !== filepath);
		taskMap.set(spaceId, newList);
		client.removeTask({ spaceId, filepath });

		return {
			task: new Map(taskMap)
		};
	});
};

/**
 * 清空指定空间的所有任务
 *
 * @param {string} spaceId - 空间ID（要清空的任务分组）
 * @returns {void}
 */
export const emptyTaskWithSpaceId = (spaceId: string): void => {
	client.emptyTask({ spaceId });
	taskStore.setState((prev) => {
		const taskMap = prev.task;
		taskMap.delete(spaceId);
		return { task: new Map(taskMap) };
	});
};

/**
 * 粘贴图片自动导入并压缩的核心方法
 * 步骤：
 * 1. 前端监听粘贴事件，获取剪贴板中的图片（base64数据）。
 * 2. 通过 IPC（client.savePastedImage）把 base64 图片数据发送给主进程，主进程将其保存为本地临时图片文件，返回真实文件路径。
 * 3. 保存成功后，调用 client.scan，把新图片路径像普通文件一样推送到主流程。
 * 4. 主流程会自动将该图片加入任务列表并进行压缩处理。
 *
 * 这样，用户粘贴图片后，无需手动操作，图片会自动显示并压缩。
 *
 * @param {string} spaceId - 当前空间ID（任务分组用）
 * @param {Array<{ base64: string, ext: string, size: number }>} images - 粘贴的图片数组（包含base64、扩展名、大小）
 * @returns {Promise<void>} - 异步，无返回值
 */
export const addPasteImageTask = async (
	spaceId: string,
	images: { base64: string, ext: string, size: number }[]
): Promise<void> => {
	for (const img of images) {
		// 1. 保存图片到本地临时目录，返回真实文件路径
		const filepath = await client.savePastedImage({ base64: img.base64, ext: img.ext });
		// 2. 调用 scan，让主流程自动处理压缩（和拖拽/扫描文件一致）
		await client.scan({ directory: [filepath] });
	}
};
