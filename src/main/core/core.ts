import { getRendererHandlers } from '@egoist/tipc/main';
import { getMainWindow } from '../window';
import { Queue } from './queue';
import { BoxingTask, fileExists, getConfig, output, zip } from './utils';
import { Notification, app } from 'electron';
import { join } from 'node:path';
import { store } from '../utils/store';

// 最大并发任务数
let max = 10;
// 全局任务队列
const taskQueue = new Queue<BoxingTask>();

// 全局缓存通知开关
let notificationEnabled = true;
// 启动时初始化通知开关
try {
	const s = store.get('notification-settings') as { enabled: boolean } | undefined;
	if (typeof s?.enabled === 'boolean') notificationEnabled = s.enabled;
} catch { }

// 每个工作区的任务统计（spaceId -> {总数, 完成数, 提示语}）
const workspaceTaskMap = new Map<string, { total: number; finished: number; message: string; }>();

// 导出给 tipc/ui.ts 用于同步通知开关
export function setNotificationEnabledInCore(enabled: boolean) {
	notificationEnabled = enabled;
}

// 新增：统计任务总数
export function setWorkspaceTaskTotal(spaceId: string, total: number, message: string) {
	if (total > 0) {
		workspaceTaskMap.set(spaceId, { total, finished: 0, message });
	}
}

// 检查并在所有任务完成时弹出系统通知
function notifyWorkspace(spaceId: string) {
	// 通知未开启或不支持
	if (!notificationEnabled || !Notification.isSupported()) return;
	// 获取任务统计信息
	const info = workspaceTaskMap.get(spaceId);
	if (!info) return;
	// 只在全部完成时通知
	if (info.finished === info.total && info.total > 0) {
		// 获取应用路径
		let iconPath: string | undefined;
		const appPath = app.getAppPath();
		if (process.platform === 'win32') {
			iconPath = join(appPath, 'resources/icons/win/icon.ico');
		} else if (process.platform === 'darwin') {
			iconPath = join(appPath, 'resources/icons/mac/icon.icns');
		} else {
			iconPath = join(appPath, 'resources/icons/linux/icon.png');
		}
		// 创建通知
		const notification = new Notification({
			title: 'PixZip Lite',
			body: info.message || "finished",
			icon: iconPath,
			silent: false
		});
		notification.show();
		// 通知后移除记录
		workspaceTaskMap.delete(spaceId);
	}
}

// 发送任务完成数据到渲染进程
async function sendCompletedData(data: CompletedTask) {
	// 获取主窗口
	const window = await getMainWindow();
	// 获取事件处理器
	const handlers = getRendererHandlers<RendererHandlers>(window.webContents);
	// 通知渲染进程任务完成
	handlers.completed.send(data);

	// 统计完成数
	const info = workspaceTaskMap.get(data.spaceId);
	if (info) {
		info.finished++;
		notifyWorkspace(data.spaceId);
	}
}

// 发送任务失败数据到渲染进程
async function sendFailedData(data: FailedTask) {
	// 获取主窗口
	const window = await getMainWindow();
	// 获取事件处理器
	const handlers = getRendererHandlers<RendererHandlers>(window.webContents);
	// 通知渲染进程任务失败
	handlers.failed.send(data);

	// 统计完成数（失败也算完成）
	const info = workspaceTaskMap.get(data.spaceId);
	if (info) {
		info.finished++;
		notifyWorkspace(data.spaceId);
	}
}

// 启动任务队列，按最大并发数依次执行
function bootTask() {
	const length = taskQueue.toArray().length; // 当前队列长度
	const min = Math.min(max, length); // 本轮可启动的任务数
	for (let i = 0; i < min; i++) {
		const task = taskQueue.dequeue(); // 取出一个任务
		if (task) {
			max--; // 占用一个并发位
			if (!fileExists(task.filepath)) { // 文件不存在，直接失败
				sendFailedData({
					...task,
					status: 'failed'
				});
				max++;
				bootTask();
			} else {
				zip(task) // 压缩图片
					.then((buffer) => {
						return output(buffer, task); // 输出到目标文件
					})
					.then(({ size, filepath: outputPath }) => {
						sendCompletedData({
							...task,
							status: 'completed',
							outputPath,
							outSize: size
						});
						max++;
						bootTask();
					})
					.catch((e) => {
						console.error('catch', e);
						sendFailedData({
							...task,
							status: 'failed'
						});
						max++;
						bootTask();
					});
			}
		}
	}
}

// 添加任务到队列并启动
export function addTask(tasks: ProcessingTask[]) {
	for (const t of tasks) {
		const box = boxing(t); // 任务与空间配置合并
		box.forEach((item) => taskQueue.enqueue(item));
	}
	bootTask();
}

// 合并任务与空间配置，生成 BoxingTask
function boxing(task: ProcessingTask) {
	const config = structuredClone(getConfig(task.spaceId));
	const list: BoxingTask[] = [];

	if (config) {
		list.push({ ...config, ...task });
	}
	return list;
}

// 清空指定空间的任务队列
export function clearTask(spaceId: string) {
	const copy = taskQueue.toArray();
	const filter = copy.filter((element) => element.spaceId !== spaceId);
	taskQueue.clear();
	if (filter.length) addTask(filter);
}

// 删除指定空间和文件路径的任务
export function delTask({ spaceId, filepath }: { spaceId: string; filepath: string }) {
	const copy = taskQueue.toArray();
	const filter = copy.filter(
		(element) => element.spaceId !== spaceId && element.filepath !== filepath
	);
	taskQueue.clear();
	if (filter.length) addTask(filter);
}
