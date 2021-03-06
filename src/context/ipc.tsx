import { Window, UserData, LogsQueryParams } from "./interfaces";
import { IConfig } from "lumi-cli/dist/lib/utils/Config";
import IPCEvents from "./ipc-events";
import Paths from "src/pages/paths";

const logo = require("src/assets/lumi_logo.png");
const { ipcRenderer } = window.require("electron");

export default class IPC {
  static registration: ServiceWorkerRegistration;

  static createRoom = (context: any, source: string, password?: string) => {
    context.update({
      connected: false,
      loading: true,
      loadingTitle: "Creating room",
    });

    return ipcRenderer
      .invoke(IPCEvents.CREATE_ROOM, source, password)
      .then((res: any) => {
        if (res.error) {
          return {
            error: res.error,
          };
        } else {
          return IPC.joinRoom(context, res.roomId, source, res.hash);
        }
      })
      .finally(() => {
        context.update({
          loading: false,
        });
      });
  };

  static joinRoom = (
    context: any,
    roomID: string,
    source: string,
    hash?: string
  ) => {
    context.update({
      connected: false,
      loading: true,
      loadingTitle: "Joining room",
    });

    return ipcRenderer
      .invoke(IPCEvents.JOIN_ROOM, roomID, source, hash)
      .then((res: any) => {
        if (res.error) {
          return {
            error: res.error,
          };
        } else {
          context.update({
            room: res,
            connected: true,
            loading: false,
          });

          return true;
        }
      })
      .finally(() => {
        context.update({
          loading: false,
        });
      });
  };

  static leaveRoom = (): Promise<boolean> => {
    return ipcRenderer.invoke(IPCEvents.LEAVE_ROOM);
  };

  static selectDir = (): Promise<void> => {
    return ipcRenderer.invoke(IPCEvents.SELECT_DIR);
  };

  static selectAvatar = (): Promise<string> => {
    return ipcRenderer.invoke(IPCEvents.SELECT_AVATAR);
  };

  static fetchLogs = (
    roomId: string,
    amount: number,
    config?: LogsQueryParams
  ): Promise<[]> => {
    return ipcRenderer.invoke(IPCEvents.FETCH_LOG, roomId, amount, config);
  };

  static fetchFolder = (folder: string, roomId: string): Promise<any> => {
    return ipcRenderer.invoke(IPCEvents.FETCH_FOLDER, folder, roomId);
  };

  static fetchUsers = (roomId: string): Promise<any> => {
    return ipcRenderer.invoke(IPCEvents.FETCH_USERS, roomId);
  };

  static updateUsers = (callback: (users: [UserData]) => void) => {
    ipcRenderer.on(IPCEvents.UPDATE_USERS, (_: any, users: [UserData]) => {
      callback(users);
    });
  };

  static updateFolder = (
    callback: (treeDataAndFileMap: {
      fileMap: unknown;
      treeData: unknown;
    }) => any
  ) => {
    ipcRenderer.on(
      IPCEvents.UPDATE_FOLDER,
      (_: any, treeDataAndFileMap: any) => {
        console.log(treeDataAndFileMap);
        callback(treeDataAndFileMap);
      }
    );
  };

  static createWindow = (window: Window) => {
    return ipcRenderer.invoke(IPCEvents.CREATE_WINDOW, window);
  };

  static saveUserSettings = async (
    avatarPath: string,
    username: string
  ): Promise<IConfig> => {
    return ipcRenderer
      .invoke(IPCEvents.SAVE_USER_SETTINGS, avatarPath, username)
      .then(() => {
        return IPC.fetchSettings();
      });
  };

  static saveRoomSettings = async (values: any): Promise<IConfig> => {
    return ipcRenderer.invoke(IPCEvents.SAVE_ROOM_SETTINGS, values).then(() => {
      return IPC.fetchSettings();
    });
  };

  static saveInterfaceSettings = async (values: any): Promise<IConfig> => {
    return ipcRenderer
      .invoke(IPCEvents.SAVE_INTERFACE_SETTINGS, values)
      .then(() => {
        return IPC.fetchSettings();
      });
  };

  static fetchSettings = (): Promise<IConfig> => {
    return ipcRenderer.invoke(IPCEvents.FETCH_SETTINGS);
  };

  static notify = (title: string, body?: any) => {
    new Promise((res, rej) => {
      if (window.Notification.permission === "granted") {
        res();
      }
      window.Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          res();
        } else {
          rej();
        }
      });
    }).then(() => {
      new window.Notification(title, {
        icon: logo,
        silent: true,
        body,
      });
    });
  };

  // TODO We might use the service worker to use notification actions
  static SWnotify = (title: string, body?: any) => {
    IPC.registration.showNotification(title, {
      body,
      actions: [
        {
          action: "yes",
          title: "Yes",
        },
      ],
    });

    window.addEventListener(
      "notificationclick",
      function(event: any) {
        event.notification.close();
        if (event.action === "yes") {
          // Archive action was clicked
          window.alert("yes");
        } else {
          window.alert("no");
        }
      },
      {
        capture: false,
        once: true,
      }
    );
  };

  static openInvite = (roomId: string) => {
    return IPC.createWindow({
      width: 580,
      height: 300,
      path: `/invite/${roomId}`,
    });
  };

  static openLogs = (roomId: string) => {
    return IPC.createWindow({
      width: 800,
      height: 800,
      path: `/serverlog/${roomId}`,
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
