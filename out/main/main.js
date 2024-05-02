"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const i18n = require("i18next");
require("electron-log");
const settings = require("electron-settings");
require("fs");
const i18NextBackend = require("i18next-fs-backend");
const path = require("path");
require("util");
const electronUpdater = require("electron-updater");
async function installExtensions() {
  const {
    installExtension,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS
  } = require("electron-extension-installer");
  const opts = {
    forceDownload: !!process.env.UPGRADE_EXTENSIONS,
    loadExtensionOptions: {
      allowFileAccess: true
    }
  };
  try {
    await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], opts);
  } catch (e) {
    console.warn(`Error installing extension: ${e}`);
  }
}
const i18NextBackendOptions = {
  loadPath: path.join(__dirname, "{{lng}}/{{ns}}.json"),
  addPath: path.join(__dirname, "{{lng}}/{{ns}}.json"),
  jsonIndent: 2
};
const languageList = [
  { name: "Arabic", code: "ar", original: "العربية" },
  { name: "Chinese Simplified", code: "zh-CN", original: "中文简体" },
  { name: "Chinese Traditional", code: "zh-TW", original: "中文繁體" },
  { name: "English", code: "en", original: "English" },
  { name: "French", code: "fr", original: "Française" },
  { name: "German", code: "de", original: "Deutsch" },
  { name: "Hindi", code: "hi", original: "हिंदी" },
  { name: "Hungarian", code: "hu", original: "Magyar" },
  { name: "Italian", code: "it", original: "Italiano" },
  { name: "Japanese", code: "ja", original: "日本語" },
  { name: "Kannada", code: "kn", original: "ಕನ್ನಡ" },
  { name: "Korean", code: "ko", original: "한국어" },
  { name: "Malayalam", code: "ml-IN", original: "മലയാളം" },
  { name: "Persian", code: "fa", original: "فارسی" },
  { name: "Polish", code: "pl", original: "Polski" },
  { name: "Portuguese", code: "pt-PT", original: "Português" },
  { name: "Portuguese (Brazil)", code: "pt-BR", original: "Português (Brasil)" },
  { name: "Russian", code: "ru", original: "Русский" },
  { name: "Spanish", code: "es-ES", original: "Español" },
  { name: "Telugu", code: "te", original: "తెలుగు" },
  { name: "Turkish", code: "tr", original: "Türk" },
  { name: "Ukrainian", code: "uk", original: "Українська" }
];
const config = {
  platform: process.platform,
  languages: languageList.map((language) => language.code),
  fallbackLng: "en",
  namespace: "translation"
};
function getI18NextOptions(backend) {
  return {
    backend,
    // debug: true,
    // saveMissing: true,
    interpolation: {
      escapeValue: false
    },
    lng: settings && settings.getSync("PREFERRED_LANGUAGE") || "en",
    fallbackLng: config.fallbackLng,
    whitelist: config.languages
  };
}
const i18nextOptions = getI18NextOptions(i18NextBackendOptions);
if (!i18n.isInitialized) {
  i18n.use(i18NextBackend).init(i18nextOptions);
}
function getAppiumSessionFilePath(argv, isPackaged, isDev2) {
  if (isDev2) {
    return false;
  }
  if (process.platform === "darwin" && !isDev2) {
    return false;
  }
  const argvIndex = isPackaged ? 1 : 2;
  return argv[argvIndex];
}
const t = (string, params = null) => i18n.t(string, params);
const APPIUM_SESSION_EXTENSION = "appiumsession";
const RELEASES_LINK = "https://github.com/appium/appium-inspector/releases";
electronUpdater.autoUpdater.autoDownload = false;
electronUpdater.autoUpdater.autoInstallOnAppQuit = false;
electronUpdater.autoUpdater.on("error", (error) => {
  electron.dialog.showErrorBox(t("Could not download update"), t("updateDownloadFailed", { message: error }));
});
electronUpdater.autoUpdater.on("update-not-available", () => {
  electron.dialog.showMessageBox({
    type: "info",
    buttons: [t("OK")],
    message: t("No update available"),
    detail: t("Appium Inspector is up-to-date")
  });
});
electronUpdater.autoUpdater.on("update-available", async ({ version, releaseDate }) => {
  const pubDate = new Date(releaseDate).toDateString();
  const { response } = await electron.dialog.showMessageBox({
    type: "info",
    message: t("appiumIsAvailable", { name: version }),
    buttons: [t("Install Now"), t("Install Later")],
    detail: t("updateDetails", { pubDate, notes: RELEASES_LINK })
  });
  if (response === 0) {
    electron.dialog.showMessageBox({
      type: "info",
      buttons: [t("OK")],
      message: t("updateIsBeingDownloaded")
    });
    electronUpdater.autoUpdater.downloadUpdate();
  }
});
electronUpdater.autoUpdater.on("update-downloaded", async ({ releaseName }) => {
  const { response } = await electron.dialog.showMessageBox({
    type: "info",
    buttons: [t("Restart Now"), t("Later")],
    message: t("Update Downloaded"),
    detail: t("updateIsDownloaded", { releaseName })
  });
  if (response === 0) {
    electronUpdater.autoUpdater.quitAndInstall();
  }
});
function checkForUpdates() {
  electronUpdater.autoUpdater.checkForUpdates();
}
const INSPECTOR_DOCS_URL = "https://appium.github.io/appium-inspector";
const APPIUM_DOCS_URL = "https://appium.io";
const APPIUM_FORUM_URL = "https://discuss.appium.io";
const GITHUB_ISSUES_URL = "https://github.com/appium/appium-inspector/issues";
const CROWDIN_URL = "https://crowdin.com/project/appium-desktop";
const separator = { type: "separator" };
function showAppInfoPopup() {
  electron.dialog.showMessageBox({
    title: t("appiumInspector"),
    message: t("showAppInfo", {
      appVersion: electron.app.getVersion(),
      electronVersion: process.versions.electron,
      nodejsVersion: process.versions.node
    })
  });
}
async function openFile(mainWindow2) {
  const { canceled, filePaths } = await electron.dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Appium Session Files", extensions: [APPIUM_SESSION_EXTENSION] }]
  });
  if (!canceled) {
    const filePath = filePaths[0];
    mainWindow2.webContents.send("open-file", filePath);
  }
}
async function saveAs(mainWindow2) {
  const { canceled, filePath } = await electron.dialog.showSaveDialog({
    title: t("saveAs"),
    filters: [{ name: "Appium", extensions: [APPIUM_SESSION_EXTENSION] }]
  });
  if (!canceled) {
    mainWindow2.webContents.send("save-file", filePath);
  }
}
function getLanguagesMenu() {
  return languageList.map((language) => ({
    label: `${language.name} (${language.original})`,
    type: "radio",
    checked: i18n.language === language.code,
    click: () => i18n.changeLanguage(language.code)
  }));
}
function optionAbout() {
  return {
    label: t("About Appium Inspector"),
    click: () => showAppInfoPopup()
  };
}
function optionCheckForUpdates() {
  return {
    label: t("Check for Updates…"),
    click: () => checkForUpdates()
  };
}
function dropdownApp() {
  return {
    label: t("appiumInspector"),
    submenu: [
      optionAbout(),
      optionCheckForUpdates(),
      separator,
      { label: t("Hide Appium Inspector"), role: "hide" },
      { label: t("Hide Others"), role: "hideOthers" },
      { label: t("Show All"), role: "unhide" },
      separator,
      { label: t("Quit Appium Inspector"), role: "quit" }
    ]
  };
}
function dropdownFile(mainWindow2, isMac) {
  const submenu = [
    { label: t("New Window"), accelerator: "CmdOrCtrl+N", click: launchNewSessionWindow },
    { label: t("Close Window"), role: "close" },
    separator,
    { label: t("Open Session File…"), accelerator: "CmdOrCtrl+O", click: () => openFile(mainWindow2) },
    { label: t("saveAs"), accelerator: "CmdOrCtrl+S", click: () => saveAs(mainWindow2) }
  ];
  if (!isMac) {
    submenu.push(...[separator, optionAbout(), optionCheckForUpdates()]);
  }
  return {
    label: t("File"),
    submenu
  };
}
function dropdownEdit() {
  return {
    label: t("Edit"),
    submenu: [
      { label: t("Undo"), role: "undo" },
      { label: t("Redo"), role: "redo" },
      separator,
      { label: t("Cut"), role: "cut" },
      { label: t("Copy"), role: "copy" },
      { label: t("Paste"), role: "paste" },
      { label: t("Delete"), role: "delete" },
      { label: t("Select All"), role: "selectAll" }
    ]
  };
}
function dropdownView(isDev2) {
  const submenu = [
    { label: t("Toggle Full Screen"), role: "togglefullscreen" },
    { label: t("Reset Zoom Level"), role: "resetZoom" },
    { label: t("Zoom In"), role: "zoomIn" },
    { label: t("Zoom Out"), role: "zoomOut" },
    separator,
    { label: t("Languages"), submenu: getLanguagesMenu() }
  ];
  if (isDev2) {
    submenu.push(
      ...[
        separator,
        { label: t("Reload"), role: "reload" },
        { label: t("Toggle Developer Tools"), role: "toggleDevTools" }
      ]
    );
  }
  return {
    label: t("View"),
    submenu
  };
}
function dropdownWindow() {
  return {
    label: t("Window"),
    submenu: [
      { label: t("Minimize"), role: "minimize" },
      { label: t("Zoom"), role: "zoom" },
      separator,
      { label: t("Bring All to Front"), role: "front" }
    ]
  };
}
function dropdownHelp() {
  return {
    label: t("Help"),
    submenu: [
      { label: t("Inspector Documentation"), click: () => electron.shell.openExternal(INSPECTOR_DOCS_URL) },
      { label: t("Appium Documentation"), click: () => electron.shell.openExternal(APPIUM_DOCS_URL) },
      { label: t("Appium Discussion Forum"), click: () => electron.shell.openExternal(APPIUM_FORUM_URL) },
      separator,
      { label: t("Report Issues"), click: () => electron.shell.openExternal(GITHUB_ISSUES_URL) },
      { label: t("Improve Translations"), click: () => electron.shell.openExternal(CROWDIN_URL) }
    ]
  };
}
function menuTemplate(mainWindow2, isMac, isDev2) {
  return [
    ...isMac ? [dropdownApp()] : [],
    dropdownFile(mainWindow2, isMac),
    dropdownEdit(),
    dropdownView(isDev2),
    ...isMac ? [dropdownWindow()] : [],
    dropdownHelp()
  ];
}
function rebuildMenus(mainWindow2, isDev2) {
  const isMac = process.platform === "darwin";
  const menu = electron.Menu.buildFromTemplate(menuTemplate(mainWindow2, isMac, isDev2));
  if (isMac) {
    electron.Menu.setApplicationMenu(menu);
  } else {
    mainWindow2.setMenu(menu);
  }
}
let mainWindow = null;
function buildSplashWindow() {
  return new electron.BrowserWindow({
    width: 300,
    height: 300,
    minWidth: 300,
    minHeight: 300,
    frame: false
  });
}
function buildSessionWindow() {
  const window = new electron.BrowserWindow({
    show: false,
    width: 1100,
    height: 710,
    minWidth: 890,
    minHeight: 710,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      additionalArguments: exports.openFilePath ? [`filename=${exports.openFilePath}`] : []
    }
  });
  electron.ipcMain.on("save-file-as", async () => {
    const { canceled, filePath } = await electron.dialog.showSaveDialog(mainWindow, {
      title: "Save Appium File",
      filters: [{ name: "Appium Session Files", extensions: [APPIUM_SESSION_EXTENSION] }]
    });
    if (!canceled) {
      mainWindow.webContents.send("save-file", filePath);
    }
  });
  return window;
}
function setupMainWindow({ splashUrl, mainUrl, isDev: isDev2 }) {
  const splashWindow = buildSplashWindow();
  mainWindow = buildSessionWindow();
  splashWindow.loadURL(splashUrl);
  splashWindow.show();
  mainWindow.loadURL(mainUrl);
  mainWindow.webContents.on("did-finish-load", () => {
    splashWindow.destroy();
    mainWindow.show();
    mainWindow.focus();
    if (isDev2) {
      mainWindow.openDevTools();
    }
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  mainWindow.webContents.on("context-menu", (e, props) => {
    const { x, y } = props;
    electron.Menu.buildFromTemplate([
      {
        label: i18n.t("Inspect element"),
        click() {
          mainWindow.inspectElement(x, y);
        }
      }
    ]).popup(mainWindow);
  });
  i18n.on("languageChanged", async (languageCode) => {
    rebuildMenus(mainWindow, isDev2);
    await settings.set("PREFERRED_LANGUAGE", languageCode);
    electron.webContents.getAllWebContents().forEach((wc) => {
      wc.send("appium-language-changed", {
        language: languageCode
      });
    });
  });
  rebuildMenus(mainWindow, isDev2);
}
function launchNewSessionWindow() {
  const url = `file://${__dirname}/index.html`;
  const win = buildSessionWindow();
  win.loadURL(url);
  win.show();
}
const isDev = process.env.NODE_ENV === "development";
exports.openFilePath = getAppiumSessionFilePath(process.argv, electron.app.isPackaged, isDev);
electron.app.on("open-file", (event, filePath) => {
  exports.openFilePath = filePath;
});
electron.app.on("window-all-closed", () => {
  electron.app.quit();
});
electron.app.on("ready", async () => {
  if (isDev) {
    require("electron-debug")();
    await installExtensions();
  }
  setupMainWindow({
    mainUrl: process.env.ELECTRON_RENDERER_URL,
    splashUrl: `file://${__dirname}/../renderer/splash.html`,
    isDev
  });
});
