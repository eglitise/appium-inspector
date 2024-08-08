import {ipcMain} from 'electron';
import settings from 'electron-settings';

import i18n from './i18next';

export const isDev = process.env.NODE_ENV === 'development';

export function setupIPCListeners () {
  ipcMain.handle('settings-has', async (_evt, key) => await settings.has(key));
  ipcMain.on('settings-set', async (_evt, key, value) => await settings.set(key, value));
  ipcMain.handle('settings-get', async (_evt, key) => await settings.get(key));
  ipcMain.handle('settings-getSync', (_evt, key) => settings.getSync(key));
}

export function getAppiumSessionFilePath(argv, isPackaged) {
  if (isDev) {
    // do not use file launcher in dev mode because argv is different
    // then it is in production
    return false;
  }
  if (process.platform === 'darwin' && !isDev) {
    // packaged macOS apps do not receive args from process.argv, they
    // receive the filepath argument from the `electron.app.on('open-file', cb)` event
    return false;
  }
  const argvIndex = isPackaged ? 1 : 2;
  return argv[argvIndex];
}

export const t = (string, params = null) => i18n.t(string, params);

export const APPIUM_SESSION_EXTENSION = 'appiumsession';
