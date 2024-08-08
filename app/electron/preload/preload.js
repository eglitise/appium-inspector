import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('settings', {
  has: async (key) => await ipcRenderer.invoke('settings-has', key),

  get: async (key) => await ipcRenderer.invoke('settings-get', key),

  getSync: (key) => ipcRenderer.invoke('settings-getSync', key),

  set: (key, val) => {
    ipcRenderer.send('settings-set', key, val);
  },
});
