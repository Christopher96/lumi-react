import { API } from "lumi-cli/dist/api/API";
import { FS } from "lumi-cli/dist/lib/common/FS";
import { Events } from "lumi-cli/dist/api/routes/SocketEvents";
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

export default class IPC {
  static win: any;
  static connection: Connection;

  static notify(title: string, body?: string) {
    IPC.win.webContents.send(IPCEvents.NOTIFICATION, title, body);
  }

  static getUsers = async (roomId: string) => {
    const serverResponse = await API.RoomRequest.listUsersInRoom(roomId);

    if (serverResponse.ok) {
      return serverResponse.users;
    } else {
      return false;
    }
  };

  static getTreeData = (path: string) => {
    return new FileTree().make(path);
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
          }, 5000);

          socket.once(Events.room_join_err, (res: any) => {
            resolve({
              error: res.message,
            });
          });

          socket.once(Events.room_join_res, async () => {
            const zippedRoom = await API.RoomRequest.downloadRoom(roomId);
            await FS.createShadow(source, zippedRoom);

            FS.listenForLocalFileChanges(source, (fileChange: IFileChange) => {
              socket.emit(Events.room_file_change, {
                change: fileChange,
                roomId,
              });

              socket.on(Events.room_file_change_err, (e: FileEventRequest) => {
                console.log(e);
                IPC.notify("Could not apply patch", `File: ${e.change.path}`);
              });
            });

            FS.listenForLocalPatches(source, (patch: IPatch) => {
              socket.emit(Events.room_file_change, { change: patch, roomId });
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

                  const treeData = IPC.getTreeData(source);

                  IPC.win.webContents.send(IPCEvents.UPDATE_FOLDER, treeData);

                  IPC.notify(`File updated: ${fileEventRequest.change.path}`);
                }
              }
            );

            socket.on(Events.room_users_update_res, (eventData: any) => {
              let user: any, title: string;
              const { event } = eventData;

              if (event === "JOIN") {
                title = "User joined the room";
                user = eventData.newUser;
              } else if (event === "LEAVE") {
                title = "User left the room";
                user = eventData.removedUser;
              }

              const { username, id } = user;
              if (username) title += `: ${username}`;

              IPC.notify(title, `ID: ${id}`);

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
      const res = await API.LogsRequest.getAllLogs(amount);
      return res.logs.map((l) => {
        return {
          event: l.event,
          user: l.byWhom?.username || "Unknown",
          date: new Date(l.date).toLocaleString(),
          path: l.body?.path || "",
        };
      });
    });

    ipcMain.handle(IPCEvents.FETCH_FOLDER, async (_, path: string) => {
      return IPC.getTreeData(path);
    });

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
  }
}
