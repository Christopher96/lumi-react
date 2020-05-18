import path from "path";
import navMenu from "./navmenu";
import IPC from "./ipc";

import { app, BrowserWindow } from "electron";

export default class Main {
  static mainWindow: BrowserWindow;
  static app: any;

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

    IPC.init(Main.mainWindow);

    process.env.SERVER_ENDPOINT = true
      ? "http://localhost:4200"
      : "http://it-pr-itpro-duw4azjoa0r0-1588304925.eu-west-1.elb.amazonaws.com";

    if (process.env.NODE_ENV === "development") {
      process.env.URL = "http://localhost:3000";
      Main.mainWindow.loadURL(process.env.URL);
      navMenu(Main.mainWindow);
    } else {
      process.env.URL = "./build/index.html";
      Main.mainWindow.loadFile(process.env.URL);
      Main.mainWindow.setMenu(null);
    }

    Main.mainWindow.on("closed", Main.onClose);
  }

  static init() {
    Main.app = app;
    Main.app.on("window-all-closed", Main.onWindowAllClosed);
    Main.app.on("ready", Main.onReady);
  }
}
