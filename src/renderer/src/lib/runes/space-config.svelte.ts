// 空间配置表单的响应式管理与更新，支持 Svelte context 注入
import { formDataSchema, SpaceFormData } from '$lib/schema';
import { defaultSpaceStore, spaceStore, updateSpace } from '$lib/stores/space';
import { useStore } from '@tanstack/svelte-store';
import { getContext, setContext } from 'svelte';

/**
 * SpaceConfig 类用于响应式管理当前空间的表单数据
 * 支持表单字段的校验和自动同步到全局 store
 */
export class SpaceConfig {
	// 所有空间
	private spaces = useStore(spaceStore);
	// 当前空间ID
	private spaceId = useStore(defaultSpaceStore);

	// 当前空间的表单数据，响应式获取
	formData = $derived.by(() => {
		return this.spaces.current.find((element) => element.id === this.spaceId.current);
	});

	/**
	 * 更新表单数据并同步到全局 store
	 * @param key 字段名
	 * @param value 字段值
	 */
	update = (key: keyof SpaceFormData, value: SpaceFormData[keyof SpaceFormData]) => {
		const valid = formDataSchema.parse({ ...this.formData, [key]: value });
		updateSpace(valid);
	};
}

// Svelte context key，保证唯一性
const SPACE_CONFIG_KEY = Symbol('space-config');

/**
 * 设置空间配置到 Svelte context，供子组件使用
 * @returns SpaceConfig 实例
 */
export function setSpaceConfig() {
	return setContext(SPACE_CONFIG_KEY, new SpaceConfig());
}

/**
 * 获取空间配置实例（从 context）
 * @returns SpaceConfig 实例
 */
export function getSpaceConfig() {
	return getContext<ReturnType<typeof setSpaceConfig>>(SPACE_CONFIG_KEY);
}
