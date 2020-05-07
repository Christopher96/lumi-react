import path from "path";
import dotenv from "dotenv";
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
      Main.mainWindow.loadURL(
        `file://${path.join(__dirname, "../build/index.html")}`
      );
    } else {
      Main.mainWindow.loadURL("http://localhost:3000");
      navMenu(Main.mainWindow);
    }
    Main.mainWindow.on("closed", Main.onClose);
    IPC.init(Main.mainWindow);
  }

  static init() {
    if (process.env.NODE_ENV === "local") {
      dotenv.config({
        path: path.resolve(process.cwd(), ".env.local"),
      });
    } else {
      dotenv.config({
        path: path.resolve(process.cwd(), ".env"),
      });
    }

    if (!process.env.SERVER_ENDPOINT)
      throw new Error("You need to configure host and port.");

    Main.app = app;
    Main.app.on("window-all-closed", Main.onWindowAllClosed);
    Main.app.on("ready", Main.onReady);
  }
}
