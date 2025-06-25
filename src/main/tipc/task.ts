import { tipc } from '@egoist/tipc/main';
import { addTask, clearTask, delTask, setWorkspaceTaskTotal } from '../core';

const t = tipc.create();

export const pushTask = t.procedure
	.input<{ task: ProcessingTask[], notifyMessage?: string }>()
	.action(async ({ input }) => {
		// 统计每个spaceId的任务总数
		const map = new Map<string, number>();
		for (const t of input.task) {
			map.set(t.spaceId, (map.get(t.spaceId) || 0) + 1);
		}
		for (const [spaceId, total] of map.entries()) {
			setWorkspaceTaskTotal(spaceId, total, input.notifyMessage || "");
		}
		addTask(input.task);
	});

export const emptyTask = t.procedure.input<{ spaceId: string }>().action(async ({ input }) => {
	clearTask(input.spaceId);
});

export const removeTask = t.procedure
	.input<{ spaceId: string; filepath: string }>()
	.action(async ({ input }) => {
		delTask(input);
	});
