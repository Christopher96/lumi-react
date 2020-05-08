import { ipcMain, dialog, BrowserWindow } from "electron";
import { API } from "lumi-cli/dist/api/API";
import { FS } from "lumi-cli/dist/lib/common/FS";
import { Events } from "lumi-cli/dist/api/routes/SocketEvents";
import {
  FileEvent,
  FileEventRequest,
  IPatch,
  IFileChange,
} from "lumi-cli/dist/lib/common/types";
import { FileTree } from "lumi-cli/dist/lib/common/FileTree";
import { Window } from "../../src/context/interfaces";
import IPCEvents from "../../src/context/ipc-events";

export default class IPC {
  static socket: SocketIOClient.Socket;

  static getTreeData = (path: string) => {
    return new FileTree().make(path);
  };

  static init(mainWindow: Electron.BrowserWindow) {
    ipcMain.handle(IPCEvents.CHECK_CONNECTION, async () => {
      return IPC.socket !== undefined;
    });

    ipcMain.handle(IPCEvents.SELECT_DIR, async () => {
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ["openDirectory"],
      });
      return result.filePaths[0];
    });

    ipcMain.handle(IPCEvents.CREATE_ROOM, async (_, path) => {
      const buffer = await FS.zip(path);
      const serverResponse = await API.RoomRequest.create(buffer);
      return serverResponse.roomId;
    });

    ipcMain.handle(IPCEvents.JOIN_ROOM, async (_, roomId, sourceFolderPath) => {
      console.log("JOINING ROOM");
      console.log(roomId, sourceFolderPath);

      if (IPC.socket !== undefined) {
        IPC.socket.disconnect();
      }

      const zippedRoom = await API.RoomRequest.downloadRoom(roomId);
      await FS.createShadow(sourceFolderPath, zippedRoom);

      IPC.socket = await API.RoomRequest.createSocket();

      FS.listenForLocalFileChanges(
        sourceFolderPath,
        (fileChange: IFileChange) => {
          IPC.socket.emit(Events.room_file_change, {
            change: fileChange,
            roomId,
          });
        }
      );
      FS.listenForLocalPatches(sourceFolderPath, (patch: IPatch) => {
        IPC.socket.emit(Events.room_file_change, { change: patch, roomId });
      });

      // Tell the server we would like to join.
      IPC.socket.on(
        Events.room_file_change_res,
        async (fileEventRequest: FileEventRequest) => {
          if (fileEventRequest.change.event === FileEvent.FILE_MODIFIED) {
            console.log(`File patched: ${fileEventRequest.change.path}`);
            const patch = fileEventRequest.change as IPatch;
            await FS.applyPatches(sourceFolderPath, patch);
          } else {
            const fileChange = fileEventRequest.change as IFileChange;
            await FS.applyFileChange(sourceFolderPath, fileChange);

            const treeData = IPC.getTreeData(sourceFolderPath);
            console.log(treeData);
            mainWindow.webContents.send(IPCEvents.FOLDER_UPDATE, treeData);

            console.log(`File changed: ${fileEventRequest.change.path}`);
          }
        }
      );

      IPC.socket.on("disconnect", () => {
        mainWindow.webContents.send(IPCEvents.DISCONNECTED);
      });

      IPC.socket.emit(Events.room_join, roomId);

      return true;
    });

    ipcMain.handle(IPCEvents.FETCH_LOG, async (_, amount: number) => {
      const allLogs = await API.LogsRequest.getAllLogs(amount);
      const list = allLogs.logs.map(
        (v) =>
          `> ${v.event}, ${new Date(v.date).toLocaleString()} in room ${
            v.roomId
          } by ${v.byWhom?.username || "unknown"}`
      );

      const list2: string[][] = allLogs.logs.map((v) => [
        new Date(v.date).toLocaleString(),
        `> ${v.event}, in room ${v.roomId} by ${v.byWhom?.username ||
          "unknown"}`,
      ]);

      return list2;
    });

    ipcMain.handle(IPCEvents.FETCH_FOLDER, async (_, path: string) => {
      return IPC.getTreeData(path);
    });

    ipcMain.handle(IPCEvents.CREATE_WINDOW, async (_, window: Window) => {
      let win = new BrowserWindow({
        width: window.width,
        height: window.height,
        webPreferences: {
          nodeIntegration: true,
        },
      });
      win.on("close", () => {
        win = null;
      });
      win.loadURL(process.env.URL + window.path);
      win.show();
    });
  }
}
