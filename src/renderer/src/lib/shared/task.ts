// 任务相关的辅助工具函数集合
// 用于获取当前空间配置、生成输出路径、判断任务是否存在等

import { defaultSpaceStore, spaceStore } from '$lib/stores/space';
import { taskStore } from '$lib/stores/task';
import { basename, delimiter, dirname, extname } from './utils';

/**
 * 获取当前选中的空间配置对象
 * @returns 当前 Pixzip.Space 配置对象，未找到则返回 undefined
 */
export const getCurrentConfig = () => {
	const spaces = spaceStore.state;
	const defaultId = defaultSpaceStore.state;
	const target = spaces.find((element) => element.id === defaultId);
	return target;
};

/**
 * 获取目标输出图片的扩展名
 * @param filepath 原文件路径
 * @param config 当前空间配置
 * @returns 目标扩展名字符串
 */
export const getTargetExtname = (filepath: string, config: Pixzip.Space) => {
	const ext = extname(filepath)!.toLowerCase();
	if (config.format === 'original') return ext;
	return config.format;
};

/**
 * 生成输出文件的完整路径
 * @param filepath 原文件路径
 * @param config 当前空间配置
 * @returns 输出文件路径字符串
 */
export const getOutputPath = (filepath: string, config: Pixzip.Space) => {
	let outputPath = dirname(filepath);
	const base = basename(filepath, true);
	if (!config.originalOutput && config.outputDir) {
		outputPath = config.outputDir;
	}
	const targetExt = getTargetExtname(filepath, config);
	return outputPath + delimiter + base + config.suffix + '.' + targetExt;
};

/**
 * 获取全局任务 Map（spaceId -> FileTask[]）
 * @returns 任务 Map
 */
export const getTaskMap = () => taskStore.state.task;

/**
 * 判断某空间下是否已存在指定文件路径的任务
 * @param filepath 文件路径
 * @param spaceId 空间ID
 * @returns 是否存在（true/false）
 */
export const taskExists = (filepath: string, spaceId: string) => {
	const taskMap = getTaskMap();
	const list = taskMap.get(spaceId) ?? [];
	return list.findIndex((element) => element.filepath === filepath) !== -1;
};
