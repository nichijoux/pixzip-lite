import { tipc, getRendererHandlers } from '@egoist/tipc/main';
import type { BrowserWindow } from 'electron';
import { getMainWindow } from '../window';
import { store } from '../utils/store';
import { setNotificationEnabledInCore } from '../core/core';
import { app } from 'electron';
import { outputFile } from 'fs-extra/esm';
import { randomBytes } from 'node:crypto';
import { join } from 'node:path';

const t = tipc.create();

export const maximizeApp = t.procedure.action(async () => {
	const window = await getMainWindow();
	window.setFullScreen(!window.isFullScreen())
});

export const unmaximizeApp = t.procedure.action(async () => {
	const window = await getMainWindow();
	window.unmaximize();
});

export const minimizeApp = t.procedure.action(async () => {
	const window = await getMainWindow();
	window.minimize();
});

export const closeApp = t.procedure.action(async () => {
	const window = await getMainWindow();
	window.close();
});

export const setNotificationSettings = t.procedure
	.input<{ enabled: boolean }>()
	.action(async ({ input }) => {
		store.set('notification-settings', input);
		setNotificationEnabledInCore(input.enabled);
	});

export const savePastedImage = t.procedure
	.input<{ base64: string; ext: string }>()
	.action(async ({ input }) => {
		const tempDir = join(app.getPath('userData'), 'pasted-images');
		const filename = `paste_${Date.now()}_${randomBytes(4).toString('hex')}.${input.ext}`;
		const filepath = join(tempDir, filename);
		const base64Data = input.base64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
		await outputFile(filepath, Buffer.from(base64Data, 'base64'));
		return filepath;
	});

export const registerUIHandlers = (window: BrowserWindow) => {
	const handlers = getRendererHandlers<RendererHandlers>(window.webContents);

	window.on('maximize', () => {
		handlers.maximizeApp.send();
	});
	window.on('unmaximize', () => {
		handlers.unmaximizeApp.send();
	});
};
