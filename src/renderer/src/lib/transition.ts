// 自定义 Svelte 过渡动画：flyAndScale
// 用于实现元素出现/消失时的平移+缩放+透明度动画

import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

/**
 * flyAndScale 过渡动画的参数类型
 * @property y 垂直方向平移的像素数，默认 -8
 * @property start 初始缩放比例，默认 0.95
 * @property duration 动画持续时间（毫秒），默认 200
 */
type FlyAndScaleParams = {
	y?: number;
	start?: number;
	duration?: number;
};

// flyAndScale 的默认参数
const defaultFlyAndScaleParams = { y: -8, start: 0.95, duration: 200 };

/**
 * Svelte 过渡动画：元素出现/消失时平移+缩放+透明度渐变
 *
 * @param node 需要应用动画的 DOM 元素
 * @param params 动画参数，可选
 * @returns Svelte 过渡动画配置对象
 */
export function flyAndScale(node: Element, params?: FlyAndScaleParams): TransitionConfig {
	// 获取元素原有 transform，避免动画叠加时丢失
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;
	const withDefaults: FlyAndScaleParams = { ...defaultFlyAndScaleParams, ...params };

	/**
	 * 区间数值映射工具
	 * @param valueA 原区间的值
	 * @param scaleA 原区间
	 * @param scaleB 目标区间
	 * @returns 映射后的值
	 */
	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	/**
	 * 将样式对象转为 style 字符串
	 * @param style 样式对象
	 * @returns style 属性字符串
	 */
	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return `${str}${key}:${style[key]};`;
		}, '');
	};

	// 返回 Svelte 过渡动画配置
	return {
		duration: withDefaults.duration ?? 200, // 动画时长
		delay: 0, // 无延迟
		css: (t) => {
			// t: 动画进度（0~1）
			const y = scaleConversion(t, [0, 1], [withDefaults.y!, 0]); // 平移
			const scale = scaleConversion(t, [0, 1], [withDefaults.start!, 1]); // 缩放

			return styleToString({
				transform: `${transform} translate3d(0, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut // 缓动函数，动画更自然
	};
}
