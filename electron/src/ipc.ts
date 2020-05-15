import { API } from "lumi-cli/dist/api/API";
import { FS } from "lumi-cli/dist/lib/common/FS";
import { Events } from "lumi-cli/dist/api/routes/SocketEvents";
import { Config, IConfig } from "lumi-cli/dist/lib/utils/Config";
import {
  FileEvent,
  FileEventRequest,
  IPatch,
  IFileChange,
} from "lumi-cli/dist/lib/common/types";
import FileTree from "./lib/FileTree";
import { Window, RoomData } from "../../src/context/interfaces";
import IPCEvents from "../../src/context/ipc-events";
import * as fse from "fs-extra";

const { nativeImage, ipcMain, dialog, BrowserWindow } = require("electron");

interface Connection {
  socket: SocketIOClient.Socket;
  room: RoomData;
}

enum NotifyEventType {
  FILE_CHANGE = "file_change",
  FILE_ERROR = "file_error",
  USER_JOIN = "user_join",
  USER_LEAVE = "user_leave",
}

export default class IPC {
  static win: any;
  static connection: Connection;

  static async notify(
    notifyEvent: NotifyEventType,
    title: string,
    body?: string
  ) {
    // In the future we should try to find a new approach so we don't have to read the config on disk everytime.
    const config: IConfig = await Config.get();
    let send = false;

    switch (notifyEvent) {
      case NotifyEventType.FILE_CHANGE:
        send = config.notifyFileChange;
        break;
      case NotifyEventType.FILE_ERROR:
        send = config.notifyFileError;
        break;
      case NotifyEventType.USER_JOIN:
        send = config.notifyUserJoin;
        break;
      case NotifyEventType.USER_LEAVE:
        send = config.notifyUserLeave;
        break;
      default:
        throw Error("Could not match to notify event");
    }

    if (send) IPC.win.webContents.send(IPCEvents.NOTIFICATION, title, body);
  }

  static getUsers = async (roomId: string) => {
    const serverResponse = await API.RoomRequest.listUsersInRoom(roomId);

    if (serverResponse.ok) {
      return serverResponse.users;
    } else {
      return false;
    }
  };

  static getTreeData = async (
    path: string,
    roomId: string
  ): Promise<{ treeData: any; fileMap: any }> => {
    const treeData = new FileTree().make(path);
    const fileMapRes = await API.LogsRequest.getFileMap(roomId);
    const fileMap = fileMapRes.roomMap;
    return { treeData, fileMap };
  };

  static disconnect() {
    if (IPC.connection !== undefined) {
      IPC.connection.socket.disconnect();
    }

    IPC.connection = undefined;
  }

  static init(mainWindow: any) {
    IPC.win = mainWindow;

    ipcMain.handle(IPCEvents.CHECK_CONNECTION, () => {
      if (IPC.connection !== undefined) {
        return IPC.connection.room;
      }

      return false;
    });

    ipcMain.handle(IPCEvents.SELECT_DIR, async () => {
      const result = await dialog.showOpenDialog(IPC.win, {
        properties: ["openDirectory"],
      });
      return result.filePaths[0];
    });

    ipcMain.handle(IPCEvents.CREATE_ROOM, async (_, source: string) => {
      if (!fse.existsSync(source)) {
        return {
          error: `Target directory does not exist: ${source}`,
        };
      }

      const buffer = await FS.zip(source);
      const { roomId } = await API.RoomRequest.create(buffer);

      if (roomId) {
        return roomId;
      } else {
        return {
          error: `Could not create room with source: ${source}`,
        };
      }
    });

    ipcMain.handle(
      IPCEvents.JOIN_ROOM,
      async (_, roomId: string, source: string) => {
        console.log("JOINING ROOM");
        console.log(roomId, source);

        if (!fse.existsSync(source)) {
          return {
            error: `Target directory does not exist: ${source}`,
          };
        }

        IPC.disconnect();

        const socket = await API.RoomRequest.createSocket();

        socket.on("disconnect", () => {
          IPC.disconnect();
          IPC.win.webContents.send(IPCEvents.DISCONNECTED);
        });

        const joinWait = async (resolve: any) => {
          setInterval(() => {
            resolve({
              error: `Timed out`,
            });
          }, 20000);

          socket.once(Events.room_join_err, (res: any) => {
            console.log(res);
            resolve({
              error: res.message,
            });
          });

          socket.once(Events.room_join_res, async () => {
            console.log("downloading room");
            const zippedRoom = await API.RoomRequest.downloadRoom(roomId);
            console.log("creating shadow");
            await FS.createShadow(source, zippedRoom);

            FS.listenForLocalFileChanges(source, (fileChange: IFileChange) => {
              socket.emit(Events.room_file_change, {
                change: fileChange,
                roomId,
              });
            });

            FS.listenForLocalPatches(source, (patch: IPatch) => {
              socket.emit(Events.room_file_change, { change: patch, roomId });
            });

            socket.on(Events.room_file_change_err, (e: FileEventRequest) => {
              IPC.notify(
                NotifyEventType.FILE_ERROR,
                "Could not apply patch",
                `File: ${e.change.path}`
              );
            });

            // Tell the server we would like to join.
            socket.on(
              Events.room_file_change_res,
              async (fileEventRequest: FileEventRequest) => {
                if (fileEventRequest.change.event === FileEvent.FILE_MODIFIED) {
                  const patch = fileEventRequest.change as IPatch;
                  await FS.applyPatches(source, patch);
                } else {
                  const fileChange = fileEventRequest.change as IFileChange;
                  await FS.applyFileChange(source, fileChange);
                }

                const treeData = await IPC.getTreeData(source, roomId);
                IPC.win.webContents.send(IPCEvents.UPDATE_FOLDER, treeData);

                IPC.notify(
                  NotifyEventType.FILE_CHANGE,
                  `File updated: ${fileEventRequest.change.path}`
                );
              }
            );

            socket.on(Events.room_users_update_res, (eventData: any) => {
              let user: any, title: string;
              const { event } = eventData;

              let notifyEvent: NotifyEventType;

              if (event === "JOIN") {
                title = "User joined the room";
                user = eventData.newUser;
                notifyEvent = NotifyEventType.USER_JOIN;
              } else if (event === "LEAVE") {
                title = "User left the room";
                user = eventData.removedUser;
                notifyEvent = NotifyEventType.USER_LEAVE;
              }

              const { username, id } = user;
              if (username) title += `: ${username}`;

              IPC.notify(notifyEvent, title, `ID: ${id}`);

              IPC.win.webContents.send(IPCEvents.UPDATE_USERS, eventData.users);
            });

            const room = {
              roomId,
              source,
            };

            IPC.connection = {
              socket,
              room,
            };

            resolve(room);
          });
        };

        socket.emit(Events.room_join, roomId);

        return await new Promise(joinWait);
      }
    );

    ipcMain.handle(IPCEvents.LEAVE_ROOM, async () => {
      const logo = nativeImage.createFromPath("../../src/assets/logo.png");

      dialog
        .showMessageBox(IPC.win, {
          type: "question",
          message: "Leave room",
          detail: "Are you sure you want to leave the room?",
          buttons: ["Yes", "No"],
          icon: logo,
        })
        .then((answer: any) => {
          const disconnect = answer.response === 0;
          if (disconnect) {
            IPC.disconnect();
          }

          return disconnect;
        });
    });

    ipcMain.handle(IPCEvents.FETCH_LOG, async (_, amount: number) => {
      const res = await API.LogsRequest.getAllLogs(amount, { reverse: "1" });
      return res.logs.map((l) => {
        return {
          event: l.event,
          user: l.byWhom?.username || "Unknown",
          date: new Date(l.date).toLocaleString(),
          path: l.body?.path || "",
        };
      });
    });

    ipcMain.handle(
      IPCEvents.FETCH_FOLDER,
      async (_, path: string, roomId: string) => {
        return await IPC.getTreeData(path, roomId);
      }
    );

    ipcMain.handle(IPCEvents.FETCH_USERS, async (_, roomId: string) => {
      const res = await API.RoomRequest.listUsersInRoom(roomId);
      return res.users;
    });

    ipcMain.handle(IPCEvents.CREATE_WINDOW, async (_, winProps: Window) => {
      let win = new BrowserWindow({
        width: winProps.width,
        height: winProps.height,
        webPreferences: {
          nodeIntegration: true,
        },
      });
      win.on("close", () => {
        win = null;
      });
      win.loadURL(`${process.env.URL}#${winProps.path}`);
      win.show();

      return true;
    });

    ipcMain.handle(IPCEvents.SELECT_AVATAR, async () => {
      const result = await dialog.showOpenDialog(mainWindow, {
        filters: [{ name: "Images", extensions: ["jpg", "png"] }],
      });
      return result.filePaths[0];
    });

    ipcMain.handle(
      IPCEvents.SAVE_USER_SETTINGS,
      async (_, avatarPath: string, username: string) => {
        const config: IConfig = await Config.get();
        if (avatarPath === null) config.avatar = null;
        else if (avatarPath !== undefined)
          config.avatar = await fse.readFile(avatarPath);
        if (username !== undefined) config.username = username;
        Config.update(config);
      }
    );

    ipcMain.handle(IPCEvents.SAVE_ROOM_SETTINGS, async (_, values: any) => {
      const config: IConfig = await Config.get();
      if (values.notifyFileChange !== undefined)
        config.notifyFileChange = values.notifyFileChange;
      if (values.notifyFileError !== undefined)
        config.notifyFileError = values.notifyFileError;
      if (values.notifyUserJoin !== undefined)
        config.notifyUserJoin = values.notifyUserJoin;
      if (values.notifyUserLeave !== undefined)
        config.notifyUserLeave = values.notifyUserLeave;
      Config.update(config);
    });

    ipcMain.handle(
      IPCEvents.SAVE_INTERFACE_SETTINGS,
      async (_, values: any) => {
        const config: IConfig = await Config.get();
        if (values.theme !== undefined) config.theme = values.theme[0];
        Config.update(config);
      }
    );

    ipcMain.handle(
      IPCEvents.FETCH_SETTINGS,
      async (_): Promise<IConfig> => {
        return Config.get();
      }
    );
  }
}
