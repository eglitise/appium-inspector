import {app} from 'electron';

// import {installExtensions} from './debug';
import {getAppiumSessionFilePath, isDev} from './helpers';
import {setupMainWindow} from './windows';

export let openFilePath = getAppiumSessionFilePath(process.argv, app.isPackaged);

app.on('open-file', (event, filePath) => {
  openFilePath = filePath;
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  if (isDev) {
    require('electron-debug')();
    // TODO: uncomment this after upgrading to Electron 15+
    // await installExtensions();
  }

  setupMainWindow();
});
