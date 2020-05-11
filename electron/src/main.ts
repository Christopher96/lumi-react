import path from "path";
import { app, BrowserWindow, App } from "electron";
import navMenu from "./devmenu";
import IPC from "./ipc";

export default class Main {
  static mainWindow: BrowserWindow;
  static app: App;

  private static onWindowAllClosed() {
    if (process.platform !== "darwin") {
      Main.app.quit();
    }
  }

  private static onClose() {
    Main.mainWindow = null;
  }

  private static onReady() {
    Main.mainWindow = new BrowserWindow({
      width: 900,
      height: 680,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    if (process.env.NODE_ENV === "production") {
      process.env.URL = `file://${path.join(__dirname, "../build/index.html")}`;
    } else {
      process.env.URL = "http://localhost:3000";
      navMenu(Main.mainWindow);
    }
    Main.mainWindow.on("closed", Main.onClose);
    Main.mainWindow.loadURL(process.env.URL);

    IPC.init(Main.mainWindow);
  }

  static init() {
    if (process.env.NODE_ENV === "local") {
      process.env.SERVER_ENDPOINT = "http://localhost:4200";
    } else {
      process.env.SERVER_ENDPOINT =
        "http://it-pr-itpro-duw4azjoa0r0-1588304925.eu-west-1.elb.amazonaws.com";
    }

    Main.app = app;
    Main.app.on("window-all-closed", Main.onWindowAllClosed);
    Main.app.on("ready", Main.onReady);
  }
}

Main.init();
