import path from "path";
import navMenu from "./navmenu";
import IPC from "./ipc";

const { app, BrowserWindow } = require("electron");

export default class Main {
  static mainWindow: any;
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

    if (process.env.NODE_ENV === "development") {
      process.env.URL = "http://localhost:3000";
      navMenu(Main.mainWindow);
    } else {
      process.env.URL = `file://${path.resolve(
        process.execPath,
        "../resources/app.asar/build/index.html"
      )}`;
    }

    const local = false;
    process.env.SERVER_ENDPOINT = local
      ? "http://localhost:4200"
      : "http://it-pr-itpro-duw4azjoa0r0-1588304925.eu-west-1.elb.amazonaws.com";

    IPC.init(Main.mainWindow);

    Main.mainWindow.loadURL(process.env.URL);
    Main.mainWindow.on("closed", Main.onClose);
  }

  static init() {
    Main.app = app;
    Main.app.on("window-all-closed", Main.onWindowAllClosed);
    Main.app.on("ready", Main.onReady);
  }
}
