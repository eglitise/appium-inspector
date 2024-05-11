// let log,
//   settings,
//   clipboard,
//   shell,
//   remote,
//   ipcRenderer,
//   i18NextBackend,
//   i18NextBackendOptions,
//   fs,
//   util;

// function buildForBrowser() {
//   if (process.env.BUILD_BROWSER) {
//     return true;
//   }

//   if (typeof navigator !== 'undefined' && !/electron/i.test(navigator.userAgent)) {
//     return true;
//   }

//   return false;
// }

// if (buildForBrowser()) {
//   ({
//     log,
//     settings,
//     clipboard,
//     shell,
//     remote,
//     ipcRenderer,
//     i18NextBackend,
//     i18NextBackendOptions,
//     fs,
//     util,
//   } = await import('./browser'));
// } else {
//   ({
//     log,
//     settings,
//     clipboard,
//     shell,
//     remote,
//     ipcRenderer,
//     i18NextBackend,
//     i18NextBackendOptions,
//     fs,
//     util,
//   } = await import('./electron'));
// }

import { clipboard, ipcRenderer, shell } from 'electron';
// import remote from 'electron';
// import log from 'electron-log';
import settings from 'electron-settings';
import fs from 'fs';
import i18NextBackend from 'i18next-fs-backend';
import util from 'util';

const i18NextBackendOptions = {
  loadPath: 'app/renderer/src/assets/locales/{{lng}}/{{ns}}.json',
  addPath: 'app/renderer/src/assets/locales/{{lng}}/{{ns}}.json',
  jsonIndent: 2,
};

const log = console;
const remote = null;

export {
  log,
  clipboard,
  shell,
  remote,
  ipcRenderer,
  settings,
  i18NextBackend,
  i18NextBackendOptions,
  fs,
  util,
};
