const ipcInit = require("./ipc");
const electron = require("electron");
const { app, BrowserWindow } = electron;

const path = require("path");
const isDev = require("electron-is-dev");

if (isDev !== true) {
  // const { fork } = require('child_process');
  // const ps = fork(`${__dirname}/lumi-client/dist/index.js`);
  console.log("hello production");
}

let mainWindow;

function createWindow() {
  console.log("asd");
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
  ipcInit(mainWindow);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
