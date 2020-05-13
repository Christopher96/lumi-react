import { Window, UserData } from "./interfaces";
import IPCEvents from "./ipc-events";
import Paths from "src/pages/paths";

const logo = require("src/assets/logo.png");
const { ipcRenderer } = window.require("electron");

export default class IPC {
  static registration: ServiceWorkerRegistration;

  static createRoom = async (context: any, source: string) => {
    console.log(source);
    return await ipcRenderer
      .invoke(IPCEvents.CREATE_ROOM, source)
      .then((res: any) => {
        if (res.error) {
          return {
            error: res.error,
          };
        } else {
          return IPC.joinRoom(context, res, source);
        }
      })
      .finally(() => {
        context.update({
          loading: false,
        });
      });
  };

  static joinRoom = async (context: any, roomID: string, source: string) => {
    return await ipcRenderer
      .invoke(IPCEvents.JOIN_ROOM, roomID, source)
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

  static selectDir = (): Promise<void> => {
    return ipcRenderer.invoke(IPCEvents.SELECT_DIR);
  };

  static fetchLogs = (amount: number): Promise<void> => {
    return ipcRenderer.invoke(IPCEvents.FETCH_LOG, amount);
  };

  static fetchFolder = (folder: string): Promise<void> => {
    return ipcRenderer.invoke(IPCEvents.FETCH_FOLDER, folder);
  };

  static fetchUsers = (roomId: string): Promise<any> => {
    return ipcRenderer.invoke(IPCEvents.FETCH_USERS, roomId);
  };

  static updateUsers = (callback: (users: [UserData]) => void) => {
    ipcRenderer.on(IPCEvents.UPDATE_USERS, (_: any, users: [UserData]) => {
      callback(users);
    });
  };

  static updateFolder = (callback: (treeData: any) => any) => {
    ipcRenderer.on(IPCEvents.UPDATE_FOLDER, (_: any, treeData: any) => {
      callback(treeData);
    });
  };

  static createWindow = (window: Window) => {
    return ipcRenderer.invoke(IPCEvents.CREATE_WINDOW, window);
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
