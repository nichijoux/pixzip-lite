// 客户端与主进程通信的封装（基于 tipc）
// 用于在渲染进程中调用主进程的各种功能（如保存图片、任务推送等）

import { createClient, createEventHandlers } from '@egoist/tipc/renderer';
import type { Router } from '../../../main/tipc';

// 创建与主进程通信的 client，类型为 Router（主进程所有可调用方法的集合）
export const client = createClient<Router>({
	ipcInvoke: window.pixzip.ipcRenderer.invoke
});

// 创建事件处理器，用于监听主进程主动推送的事件（如任务完成、主题变更等）
export const handlers = createEventHandlers<RendererHandlers>({
	on: window.pixzip.ipcRenderer.on,
	send: window.pixzip.ipcRenderer.send
});
