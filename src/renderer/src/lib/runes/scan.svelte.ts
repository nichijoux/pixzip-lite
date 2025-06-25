import { client, handlers } from '$lib/client';
import { getCurrentConfig, getOutputPath, getTargetExtname, taskExists } from '$lib/shared/task';
import { extname } from '$lib/shared/utils';
import { taskStore } from '$lib/stores/task';
import { getTranslation } from '$lib/utils/i18n';

/**
 * Scan 类用于将文件批量转为压缩任务并推送到主进程
 * 支持自动去重、自动生成输出路径
 */
export class Scan {
	/**
	 * 将文件信息列表转为 ProcessingTask 并推送到任务队列
	 * @param fileInfoList 文件信息数组
	 */
	private boxing = (fileInfoList: FileInfo[]) => {
		const config = getCurrentConfig();
		if (!config) return;
		const processingTask = this.eachTask(config, fileInfoList);
		// 更新任务 store
		taskStore.setState((prev) => {
			const taskMap = structuredClone(prev.task);
			const list = taskMap.get(config.id) ?? [];
			taskMap.set(config.id, [...list, ...processingTask]);
			return { task: new Map(taskMap) };
		});
		// 推送到主进程进行压缩
		client.pushTask({ task: processingTask, notifyMessage: getTranslation('allCompleted') });
	};

	/**
	 * 生成 ProcessingTask 列表，自动去重
	 * @param config 当前空间配置
	 * @param fileInfoList 文件信息数组
	 * @returns ProcessingTask[]
	 */
	private eachTask = (config: Pixzip.Space, fileInfoList: FileInfo[]) => {
		const processingTask: ProcessingTask[] = [];
		for (let i = 0; i < fileInfoList.length; i++) {
			const file = fileInfoList[i];
			const exists = taskExists(file.path, config.id);
			if (exists) continue;

			const outputPath = getOutputPath(file.path, config);
			const target: ProcessingTask = {
				spaceId: config.id,
				filepath: file.path,
				status: 'processing',
				fileSize: file.size,
				outputPath,
				extname: extname(file.path)!,
				targetExtname: getTargetExtname(file.path, config)
			};
			processingTask.push(target);
		}
		return processingTask;
	};

	constructor() {
		// 监听 scanned 事件，自动处理扫描结果
		$effect(() => {
			const unlisten = handlers.scanned.listen((fileInfoList) => {
				this.boxing(fileInfoList);
			});
			return () => {
				unlisten();
			};
		});
	}
}
