import { client, handlers } from '$lib/client';

/**
 * 最小化窗口
 */
export const minimizeFn = () => {
	client.minimizeApp();
};

/**
 * 最大化窗口
 */
export const maximizeFn = () => {
	client.maximizeApp();
};

/**
 * 取消最大化
 */
export const unmaximizeFn = () => {
	client.unmaximizeApp();
};

/**
 * 关闭窗口
 */
export const closeFn = () => {
	client.closeApp();
};

/**
 * WindowCtr 类用于响应最大化/还原事件，维护窗口最大化状态
 */
export class WindowCtr {
	// 是否最大化
	isMax = $state(false);

	constructor() {
		$effect(() => {
			const unlisten1 = handlers.maximizeApp.listen(() => {
				this.isMax = true;
			});

			const unlisten2 = handlers.unmaximizeApp.listen(() => {
				this.isMax = false;
			});

			return () => {
				unlisten1();
				unlisten2();
			};
		});
	}
}
