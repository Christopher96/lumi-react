const ipcInit = require("./ipc");
const electron = require("electron");
const { app, BrowserWindow } = electron;

const path = require("path");
const isDev = require("electron-is-dev");

const dotenv = require("dotenv");

if (process.env.NODE_ENV === "development") {
  dotenv.config({
    path: path.resolve(process.cwd(), ".env.local"),
  });
} else {
  dotenv.config({
    path: path.resolve(process.cwd(), ".env"),
  });
}

console.log(process.env.SERVER_ENDPOINT);
if (!process.env.SERVER_ENDPOINT)
  throw new Error("You need to configure host and port.");

let mainWindow;

function createWindow() {
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
