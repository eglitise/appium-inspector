import {clipboard, ipcRenderer, shell} from 'electron';
import fs from 'fs';
import i18NextBackend from 'i18next-fs-backend';
import {join} from 'path';
import util from 'util';

const localesPath =
  process.env.NODE_ENV === 'development'
    ? join('app', 'common', 'public', 'locales') // from project root
    : join(__dirname, '..', 'renderer', 'locales'); // from 'main' in package.json
const translationFilePath = join(localesPath, '{{lng}}', '{{ns}}.json');

const i18NextBackendOptions = {
  loadPath: translationFilePath,
  addPath: translationFilePath,
  jsonIndent: 2,
};

class ElectronSettings {
  async has(key) {
    return await window.settings.has(key);
  }

  set(key, val) {
    window.settings.set(key, val);
  }

  async get(key) {
    return await window.settings.get(key);
  }

  getSync(key) {
    return window.settings.getSync(key);
  }
}

const settings = new ElectronSettings();

export {settings, clipboard, shell, ipcRenderer, i18NextBackend, i18NextBackendOptions, fs, util};
