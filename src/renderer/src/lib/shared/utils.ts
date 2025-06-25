// 通用工具函数集合，供前端各模块复用

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 className 工具，支持条件拼接和 tailwind 优化
 * @param inputs 任意 className 字符串、对象、数组等
 * @returns 合并后的 className 字符串
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * 当前操作系统平台（win32、darwin、linux）
 */
export const OS = window.pixzip.process.platform;

/**
 * 路径分隔符，自动适配不同操作系统
 */
export const delimiter = OS === 'win32' ? '\\' : '/';

/**
 * 生成唯一字符串ID（基于时间戳和自增）
 * @returns 唯一ID字符串
 */
export const useId = (() => {
	let id = 0;
	return () => Date.now().toString(36) + id++;
})();

/**
 * 获取路径的目录部分
 * @param path 完整路径
 * @returns 目录路径
 */
export function dirname(path: string) {
	return path.split(delimiter).slice(0, -1).join(delimiter);
}

/**
 * 获取文件名（可选去除扩展名）
 * @param path 完整路径
 * @param ext 是否去除扩展名
 * @returns 文件名字符串
 */
export function basename(path: string, ext?: boolean) {
	let base = path.split(delimiter).pop()!;
	if (ext) {
		base = base.replace(/\.[^/.]+$/, '');
	}
	return base;
}

/**
 * 获取文件扩展名（不带点）
 * @param path 文件路径
 * @returns 扩展名字符串
 */
export function extname(path: string) {
	return path.split('.').pop();
}

/**
 * 生成缩略图资源路径（自定义协议）
 * @param filepath 文件路径
 * @returns thumb: 协议的缩略图路径
 */
export function thumbImg(filepath: string) {
	return `thumb:${delimiter}${delimiter}${filepath}`;
}

/**
 * 字节数转为可读文件大小字符串
 * @param bytes 字节数
 * @returns 形如 "1.2 MB" 的字符串
 */
export function bytesToSize(bytes: number) {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0 Byte';
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

/**
 * 计算压缩节省百分比
 * @param current 原始大小
 * @param total 压缩后大小
 * @returns 百分比（正数为节省，负数为增大）
 */
export function savePercentage(current: number, total: number) {
	const percent = ((current - total) / current) * 100;
	return Math.round(percent * 100) / 100;
}
