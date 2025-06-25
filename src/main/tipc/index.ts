import { copyFile, folderPicker, getVersion, revealWith, trashFile } from './action';
import { openFolder, scan } from './scan';
import { addSpace, deleteSpace, getSpaces, updateSpace } from './space';
import { pushTask, removeTask, emptyTask } from './task';
import { theme_system, theme_toggle } from './theme';
import { closeApp, maximizeApp, minimizeApp, unmaximizeApp, setNotificationSettings, savePastedImage } from './ui';

export const router = {
	getSpaces,
	addSpace,
	updateSpace,
	deleteSpace,
	maximizeApp,
	minimizeApp,
	unmaximizeApp,
	closeApp,
	folderPicker,
	scan,
	openFolder,
	pushTask,
	emptyTask,
	removeTask,
	revealWith,
	copyFile,
	trashFile,
	getVersion,
	theme_toggle,
	theme_system,
	setNotificationSettings,
	savePastedImage
};

export { registerUIHandlers } from './ui';

export type Router = typeof router;
