import { nativeTheme, BrowserWindow } from 'electron';
import { getRendererHandlers, tipc } from '@egoist/tipc/main';

const t = tipc.create();

export const theme_toggle = t.procedure
	.input<{ theme: 'light' | 'dark' }>()
	.action(async ({ input }) => {
		nativeTheme.themeSource = input.theme;
	});

export const theme_system = t.procedure
	.action(async () => {
		nativeTheme.themeSource = 'system';
	});

nativeTheme.on('updated', () => {
	for (const win of BrowserWindow.getAllWindows()) {
		const handlers = getRendererHandlers<RendererHandlers>(win.webContents);
		handlers.updateTheme.send(nativeTheme.shouldUseDarkColors);
	}
}); 