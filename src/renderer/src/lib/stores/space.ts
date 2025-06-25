// 空间（Space）管理相关的全局状态和方法
// 负责：空间的增删改查、当前空间切换、空间信息持久化等

import { client } from '$lib/client';
import { DEFAULT_SPACE } from '$lib/constants';
import { Store } from '@tanstack/svelte-store';

/**
 * 获取本地存储的默认空间ID
 * @returns 默认空间ID
 */
export const getDefaultSpace = () => {
	return window.localStorage.getItem(DEFAULT_SPACE);
};

// 所有空间的全局 store，类型为 Pixzip.Space[]
export const spaceStore = new Store<Pixzip.Space[]>([]);

// 当前选中的空间ID，全局 store
export const defaultSpaceStore = new Store<string | undefined>(undefined);

// 启动时自动获取所有空间，并设置默认空间
client.getSpaces().then((spaces) => {
	let defaultId = getDefaultSpace();
	if (!defaultId) {
		defaultId = spaces[0].id;
	} else {
		const target = spaces.find((element) => element.id === defaultId);
		if (!target) defaultId = spaces[0].id;
	}
	updateDefaultSpace(defaultId);
	spaceStore.setState(() => spaces);
});

/**
 * 切换当前默认空间
 * @param {string} id - 新的空间ID
 * @returns {void}
 */
export const updateDefaultSpace = (id: string): void => {
	window.localStorage.setItem(DEFAULT_SPACE, id);
	defaultSpaceStore.setState(() => id);
};

/**
 * 更新空间信息（如重命名、参数变更等）
 * @param {Pixzip.Space} space - 要更新的空间对象
 * @returns {void}
 */
export const updateSpace = (space: Pixzip.Space): void => {
	client.updateSpace({ space });
	spaceStore.setState((prev) => {
		const index = prev.findIndex((s) => s.id === space.id);
		if (index !== -1) prev[index] = space;
		return [...prev];
	});
};
