import { Window } from "./interfaces";
import IPCEvents from "./ipc-events";
import LumiContext from "src/context/lumi-context";
import Paths from "src/pages/paths";

const { ipcRenderer } = window.require("electron");

export default class IPC {
  static contextType = LumiContext;

  constructor(private context: any, private history: any) {
    ipcRenderer.invoke(IPCEvents.CHECK_CONNECTION, (connected: boolean) => {
      this.context.update({
        connected,
      });
    });
    this.register();
  }

  static createRoom = (source: string): Promise<void> => {
    return new Promise<void>((_, rej) => {
      ipcRenderer
        .invoke(IPCEvents.CREATE_ROOM, source)
        .then((_: any, roomID: string) => {
          return IPC.joinRoom(roomID, source);
        })
        .catch(rej);
    });
  };

  static joinRoom = (
    roomID: string,
    sourceFolderPath: string
  ): Promise<void> => {
    return ipcRenderer.invoke(IPCEvents.JOIN_ROOM, roomID, sourceFolderPath);
  };

  static selectDir = (): Promise<void> => {
    return ipcRenderer.invoke(IPCEvents.SELECT_DIR);
  };

  static fetchLogs = (amount: number): Promise<void> => {
    return ipcRenderer.invoke(IPCEvents.FETCH_LOG, amount);
  };

  static createWindow = (window: Window) => {
    return ipcRenderer.invoke(IPCEvents.CREATE_WINDOW, window);
  };

  static openSettings = () => {
    return IPC.createWindow({
      width: 800,
      height: 400,
      path: Paths.SETTINGS,
    });
  };

  register = () => {
    ipcRenderer.on(IPCEvents.NAVIGATE, (_: any, route: string) => {
      this.history.push(route);
    });

    ipcRenderer.on(IPCEvents.DISCONNECTED, () => {
      this.context.update({
        connected: false,
      });
      this.history.push(Paths.START);
    });
  };
}
