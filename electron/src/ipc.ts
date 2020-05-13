import { API } from "lumi-cli/dist/api/API";
import { FS } from "lumi-cli/dist/lib/common/FS";
import { Events } from "lumi-cli/dist/api/routes/SocketEvents";
import {
  FileEvent,
  FileEventRequest,
  IPatch,
  IFileChange,
  RoomChangedEvent,
} from "lumi-cli/dist/lib/common/types";
import FileTree from "./lib/FileTree";
import { Window, RoomData } from "../../src/context/interfaces";
import IPCEvents from "../../src/context/ipc-events";
import * as fse from "fs-extra";

const { ipcMain, dialog, BrowserWindow } = require("electron");

interface Connection {
  socket: SocketIOClient.Socket;
  room: RoomData;
}

export default class IPC {
  static connection: Connection;

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

  static init(mainWindow: any) {
    ipcMain.handle(IPCEvents.CHECK_CONNECTION, () => {
      if (IPC.connection !== undefined) {
        return IPC.connection.room;
      }

      return false;
    });

    ipcMain.handle(IPCEvents.SELECT_DIR, async () => {
      const result = await dialog.showOpenDialog(mainWindow, {
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

        if (IPC.connection !== undefined) {
          IPC.connection.socket.disconnect();
        }

        const socket = await API.RoomRequest.createSocket();

        socket.on("disconnect", () => {
          mainWindow.webContents.send(IPCEvents.DISCONNECTED);
        });

        const joinWait = async (resolve) => {
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
            console.log("hello");
            const zippedRoom = await API.RoomRequest.downloadRoom(roomId);
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

            // Tell the server we would like to join.
            socket.on(
              Events.room_file_change_res,
              async (fileEventRequest: FileEventRequest) => {
                if (fileEventRequest.change.event === FileEvent.FILE_MODIFIED) {
                  console.log(`File patched: ${fileEventRequest.change.path}`);
                  const patch = fileEventRequest.change as IPatch;
                  await FS.applyPatches(source, patch);
                } else {
                  const fileChange = fileEventRequest.change as IFileChange;
                  await FS.applyFileChange(source, fileChange);

                  const treeData = IPC.getTreeData(source);

                  mainWindow.webContents.send(
                    IPCEvents.UPDATE_FOLDER,
                    treeData
                  );

                  console.log(`File changed: ${fileEventRequest.change.path}`);
                }
              }
            );

            socket.on(
              Events.room_users_update_res,
              (eventData: RoomChangedEvent) => {
                mainWindow.webContents.send(
                  IPCEvents.UPDATE_USERS,
                  eventData.users
                );
              }
            );

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
