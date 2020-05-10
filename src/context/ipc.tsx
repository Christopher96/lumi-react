import { Window, Room } from "./interfaces";
import IPCEvents from "./ipc-events";
import Paths from "src/pages/paths";

const { ipcRenderer } = window.require("electron");

export default class IPC {
  static createRoom = async (context: any, source: string) => {
    return await ipcRenderer
      .invoke(IPCEvents.CREATE_ROOM, source)
      .then((_: any, roomID: string) => {
        return IPC.joinRoom(context, roomID, source);
      });
  };

  static joinRoom = async (
    context: any,
    roomID: string,
    sourceFolderPath: string
  ) => {
    return await ipcRenderer
      .invoke(IPCEvents.JOIN_ROOM, roomID, sourceFolderPath)
      .then((room: Room) => {
        console.log(room);
        context.update({
          room,
          connected: true,
          loading: false,
        });
      })
      .catch(() => {
        context.update({
          loading: false,
        });
      });
  };

  static selectDir = (): Promise<void> => {
    return ipcRenderer.invoke(IPCEvents.SELECT_DIR);
  };

  static fetchLogs = (amount: number): Promise<void> => {
    return ipcRenderer.invoke(IPCEvents.FETCH_LOG, amount);
  };

  static fetchFolder = (folder: string): Promise<void> => {
    return ipcRenderer.invoke(IPCEvents.FETCH_FOLDER, folder);
  };

  static fetchUsers = (roomId: string): Promise<void> => {
    return ipcRenderer.invoke(IPCEvents.FETCH_USERS, roomId);
  };

  static updateFolder = (callback: (treeData: any) => any) => {
    ipcRenderer.on(IPCEvents.UPDATE_FOLDER, (_: any, treeData: any) => {
      callback(treeData);
    });
  };

  static updateUsers = (callback: (users: any) => any) => {
    ipcRenderer.on(IPCEvents.UPDATE_USERS, (_: any, treeData: any) => {
      callback(treeData);
    });
  };

  static createWindow = (window: Window) => {
    return ipcRenderer.invoke(IPCEvents.CREATE_WINDOW, window);
  };

  static openInvite = () => {
    return IPC.createWindow({
      width: 500,
      height: 400,
      path: Paths.INVITE,
    });
  };

  static openLogs = () => {
    return IPC.createWindow({
      width: 800,
      height: 800,
      path: Paths.SERVER_LOG,
    });
  };

  static openLeave = () => {
    return IPC.createWindow({
      width: 300,
      height: 200,
      path: Paths.LEAVE,
    });
  };

  static openSettings = () => {
    return IPC.createWindow({
      width: 800,
      height: 400,
      path: Paths.SETTINGS,
    });
  };
}
