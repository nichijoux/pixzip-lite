// Svelte 国际化（i18n）配置文件
// 用于加载多语言资源，并初始化 svelte-i18n 插件，实现界面多语言切换

import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';

// 导入各语言的翻译资源（JSON 文件）
import en from './translations/en/common.json';
import zhCN from './translations/zh-CN/common.json';
import zhTW from './translations/zh-TW/common.json';

// 注册英文翻译资源
addMessages('en', en);
// 注册简体中文翻译资源
addMessages('zh-CN', zhCN);
// 注册繁体中文翻译资源
addMessages('zh-TW', zhTW);

// 初始化 i18n 配置
init({
  // 默认回退语言（找不到翻译时用英文）
  fallbackLocale: 'en',
  // 初始语言，自动检测浏览器/系统语言
  initialLocale: getLocaleFromNavigator(),
}); 