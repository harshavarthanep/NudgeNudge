// Nudge Nudge desktop app (Windows, Mac, Linux). Built by H24 Creationz.
// Keeps running in the tray when you close the window, so reminders and alarms keep ringing.
const { app, BrowserWindow, Tray, Menu, nativeImage, protocol, net, ipcMain, Notification, shell, session } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }]);

const WWW = path.join(__dirname, 'www');
const ICON = path.join(__dirname, 'build', 'icon.png');
const START_HIDDEN = process.argv.includes('--hidden');
let main = null, mini = null, tray = null, quitting = false, toldAboutTray = false;
const live = new Set();

if (!app.requestSingleInstanceLock()) { app.quit(); }
app.on('second-instance', () => showMain());
if (process.platform === 'win32') app.setAppUserModelId('com.h24creationz.nudgenudge');

function webPrefs() { return { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, backgroundThrottling: false, spellcheck: true }; }
function guardLinks(win) {
  win.webContents.setWindowOpenHandler(({ url }) => { if (url.startsWith('app://')) return { action: 'allow' }; shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('app://')) { e.preventDefault(); shell.openExternal(url); } });
}
function createMain(show) {
  main = new BrowserWindow({ width: 1240, height: 820, minWidth: 380, minHeight: 560, backgroundColor: '#101216', title: 'Nudge Nudge', icon: ICON, autoHideMenuBar: true, show: false, webPreferences: webPrefs() });
  main.loadURL('app://nudge/index.html');
  guardLinks(main);
  main.once('ready-to-show', () => { if (show) main.show(); });
  main.on('close', (e) => {
    if (quitting) return;
    e.preventDefault(); main.hide();
    if (!toldAboutTray && Notification.isSupported()) { toldAboutTray = true; new Notification({ title: 'Nudge Nudge is still running', body: 'Reminders keep ringing. Open it again from the tray icon.', icon: ICON }).show(); }
  });
}
function showMain() { if (!main) createMain(true); main.show(); if (main.isMinimized()) main.restore(); main.focus(); }
function openMini() {
  if (mini && !mini.isDestroyed()) { mini.show(); mini.focus(); return; }
  mini = new BrowserWindow({ width: 300, height: 320, minWidth: 150, minHeight: 110, alwaysOnTop: true, frame: false, resizable: true, skipTaskbar: true, backgroundColor: '#101216', title: 'Nudge Nudge mini', icon: ICON, webPreferences: webPrefs() });
  mini.setAlwaysOnTop(true, 'floating');
  try { mini.setVisibleOnAllWorkspaces(true); } catch (e) {}
  mini.loadURL('app://nudge/index.html?mini=1');
  guardLinks(mini);
  mini.on('closed', () => { mini = null; });
}
function setLogin(on) { try { app.setLoginItemSettings({ openAtLogin: on, args: ['--hidden'] }); } catch (e) {} }
function loginOn() { try { return app.getLoginItemSettings().openAtLogin; } catch (e) { return false; } }
function buildTray() {
  const img = nativeImage.createFromPath(path.join(__dirname, 'build', 'tray.png')).resize({ width: process.platform === 'darwin' ? 18 : 20 });
  tray = new Tray(img);
  tray.setToolTip('Nudge Nudge');
  const menu = () => Menu.buildFromTemplate([
    { label: 'Open Nudge Nudge', click: showMain },
    { label: 'Mini window', click: openMini },
    { type: 'separator' },
    { label: 'Start with my computer', type: 'checkbox', checked: loginOn(), click: (i) => setLogin(i.checked) },
    { type: 'separator' },
    { label: 'Quit', click: () => { quitting = true; app.quit(); } }
  ]);
  tray.setContextMenu(menu());
  tray.on('click', showMain);
  tray.on('right-click', () => tray.setContextMenu(menu()));
}

ipcMain.on('nn-notify', (_e, o) => {
  if (!Notification.isSupported()) return;
  const mac = process.platform === 'darwin';
  const n = new Notification({ title: o.title || 'Nudge Nudge', body: o.body || '', icon: ICON, silent: false, timeoutType: o.sticky ? 'never' : 'default', urgency: o.sticky ? 'critical' : 'normal', actions: mac && o.id ? [{ type: 'button', text: 'Done' }, { type: 'button', text: 'Snooze 10 min' }] : [] });
  live.add(n);
  const send = (cmd) => { if (main) main.webContents.send('nn-cmd', { cmd, id: o.id }); };
  n.on('click', () => { showMain(); send('open'); });
  n.on('action', (_ev, i) => send(i === 0 ? 'done' : 'snooze'));
  n.on('close', () => live.delete(n));
  n.show();
});
ipcMain.on('nn-mini', openMini);
ipcMain.on('nn-mini-close', () => { if (mini) mini.close(); });
ipcMain.on('nn-show', showMain);
ipcMain.handle('nn-login-get', () => loginOn());
ipcMain.on('nn-login-set', (_e, on) => setLogin(on));

app.whenReady().then(() => {
  protocol.handle('app', (req) => {
    const u = new URL(req.url);
    let p = decodeURIComponent(u.pathname); if (p === '/' || p === '') p = '/index.html';
    const file = path.normalize(path.join(WWW, p));
    if (!file.startsWith(WWW)) return new Response('Not found', { status: 404 });
    return net.fetch(pathToFileURL(file).toString());
  });
  session.defaultSession.setPermissionRequestHandler((_wc, perm, cb) => cb(['media', 'notifications'].includes(perm)));
  session.defaultSession.setPermissionCheckHandler((_wc, perm) => ['media', 'notifications'].includes(perm));
  createMain(!START_HIDDEN);
  buildTray();
});
app.on('activate', showMain);
app.on('before-quit', () => { quitting = true; });
app.on('window-all-closed', () => { /* stays in the tray */ });
