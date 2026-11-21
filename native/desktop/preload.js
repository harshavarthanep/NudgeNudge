// Safe bridge between the app page and the desktop app.
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('nnDesktop', {
  notify: (o) => ipcRenderer.send('nn-notify', o),
  onCmd: (cb) => ipcRenderer.on('nn-cmd', (_e, c) => cb(c)),
  openMini: () => ipcRenderer.send('nn-mini'),
  closeMini: () => ipcRenderer.send('nn-mini-close'),
  showMain: () => ipcRenderer.send('nn-show'),
  getLoginItem: () => ipcRenderer.invoke('nn-login-get'),
  setLoginItem: (on) => ipcRenderer.send('nn-login-set', !!on),
  platform: process.platform
});
