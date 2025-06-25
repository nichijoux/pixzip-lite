// 图片空间（Space）相关表单数据的类型定义与校验规则
// 使用 zod 进行类型安全校验，保证表单数据结构正确

import { z } from 'zod';

/**
 * 图片空间（Space）类型定义
 * @property id 空间唯一ID
 * @property name 空间名称
 * @property width 图片宽度（可选）
 * @property height 图片高度（可选）
 * @property suffix 文件名后缀
 * @property format 图片格式
 * @property level 压缩等级
 * @property originalOutput 是否输出原图
 * @property outputDir 输出目录（可选）
 * @property keepExif 是否保留EXIF信息
 */
type Space = {
	id: string;
	name: string;
	width?: number;
	height?: number;
	suffix: string;
	format: Format;
	level: number;
	originalOutput: boolean;
	outputDir?: string;
	keepExif: boolean;
};

/**
 * 支持的图片格式类型
 */
type Format = 'original' | 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif';

// zod 校验：图片格式只能是上述几种之一
const formatSchema = z
	.literal('original')
	.or(z.literal('jpg'))
	.or(z.literal('jpeg'))
	.or(z.literal('png'))
	.or(z.literal('webp'))
	.or(z.literal('avif'));

/**
 * 图片空间表单数据的 zod 校验 schema
 * 用于前端表单校验和类型推断
 */
export const formDataSchema = z.object({
	id: z.string(), // 空间ID
	name: z.string(), // 空间名称
	width: z.number().or(z.undefined()), // 图片宽度，可选
	height: z.number().or(z.undefined()), // 图片高度，可选
	suffix: z.string(), // 文件名后缀
	format: formatSchema, // 图片格式
	level: z.number(), // 压缩等级
	originalOutput: z.boolean(), // 是否输出原图
	outputDir: z.string().optional(), // 输出目录，可选
	keepExif: z.boolean() // 是否保留EXIF信息
});

// 推断表单数据类型，便于类型安全开发
export type SpaceFormData = z.infer<typeof formDataSchema>;
