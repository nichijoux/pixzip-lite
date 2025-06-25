import { handlers } from '$lib/client';
import { taskStore } from '$lib/stores/task';

/**
 * TaskScheduler 类用于自动监听任务完成/失败事件
 * 并自动更新全局任务 store 的状态
 */
export class TaskScheduler {
	constructor() {
		$effect(() => {
			// 监听任务完成事件，更新任务状态
			const unlisent1 = handlers.completed.listen((data) => {
				taskStore.setState((prev) => {
					const taskMap = structuredClone(prev.task);
					const list = taskMap.get(data.spaceId) ?? [];
					const index = list.findIndex((element) => element.outputPath === data.outputPath);
					if (index !== -1) list.splice(index, 1, data);
					return {
						task: new Map(taskMap)
					};
				});
			});

			// 监听任务失败事件，仅打印日志
			const unlisent2 = handlers.failed.listen((data) => {
				console.error('failed', data);
			});

			return () => {
				unlisent1();
				unlisent2();
			};
		});
	}
}
