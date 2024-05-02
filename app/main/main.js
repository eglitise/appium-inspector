import {app} from 'electron';

import {installExtensions} from './debug';
import {getAppiumSessionFilePath} from './helpers';
import {setupMainWindow} from './windows';

const isDev = process.env.NODE_ENV === 'development';

export let openFilePath = getAppiumSessionFilePath(process.argv, app.isPackaged, isDev);

app.on('open-file', (event, filePath) => {
  openFilePath = filePath;
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', async () => {
  if (isDev) {
    require('electron-debug')();
    await installExtensions();
  }

  setupMainWindow({
    mainUrl: process.env.ELECTRON_RENDERER_URL,
    splashUrl: `file://${__dirname}/../renderer/splash.html`,
    isDev,
  });
});
