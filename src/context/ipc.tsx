import { Window, RoomData, UserData } from "./interfaces";
import IPCEvents from "./ipc-events";
import Paths from "src/pages/paths";

const { ipcRenderer } = window.require("electron");

export default class IPC {
  static registration: ServiceWorkerRegistration;

  static createRoom = async (context: any, source: string) => {
    return await ipcRenderer
      .invoke(IPCEvents.CREATE_ROOM, source)
      .then((_: any, roomID: string) => {
        return IPC.joinRoom(context, roomID, source);
      });
  };

  static joinRoom = async (context: any, roomID: string, source: string) => {
    return await ipcRenderer
      .invoke(IPCEvents.JOIN_ROOM, roomID, source)
      .then((room: RoomData) => {
        if (room) {
          context.update({
            room,
            connected: true,
            loading: false,
          });
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
      if(window.Notification.permission === "granted") {
        res();
      } 
      window.Notification.requestPermission().then((permission) => {
        if(permission === "granted") {
          res();
        } else {
          rej();
        }
      })
    }).then(() => {
      console.log("saft");

      const notif = new window.Notification(title, {
        body,
      });
    });
  };

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
