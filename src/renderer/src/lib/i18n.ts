import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';

import en from './translations/en/common.json';
import zhCN from './translations/zh-CN/common.json';
import zhTW from './translations/zh-TW/common.json';

addMessages('en', en);
addMessages('zh-CN', zhCN);
addMessages('zh-TW', zhTW);

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
}); 