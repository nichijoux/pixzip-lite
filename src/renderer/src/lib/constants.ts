// 全局常量定义文件
// 用于存放空间（Space）相关的默认值和模板，便于统一管理和复用

/**
 * 本地存储当前选中空间ID的 key
 * 用于 localStorage 标识当前激活的空间
 */
export const DEFAULT_SPACE = 'currentSpaceId';

/**
 * 空间（Space）对象的默认模板（不含 id 字段）
 * 用于新建空间时的初始值
 * 字段说明：
 * - name: 空间名称，默认 'Space'
 * - width/height: 图片宽高，默认未指定
 * - suffix: 文件名后缀，默认 '-min'
 * - format: 图片格式，默认 'original'（原格式）
 * - level: 压缩等级，默认 1
 * - originalOutput: 是否输出原图，默认 true
 * - outputDir: 输出目录，默认空字符串
 * - keepExif: 是否保留EXIF信息，默认 false
 */
export const SPACE_TEMPLATE: Omit<Pixzip.Space, 'id'> = {
	name: 'Space',
	width: undefined,
	height: undefined,
	suffix: '-min',
	format: 'original',
	level: 1,
	originalOutput: true,
	outputDir: '',
	keepExif: false
};
