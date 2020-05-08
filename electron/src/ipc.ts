import { ipcMain, dialog } from "electron";
import { API } from "lumi-cli/dist/api/API";
import { FS } from "lumi-cli/dist/lib/common/FS";
import { Events } from "lumi-cli/dist/api/routes/SocketEvents";
import { FileEvent, FileEventRequest } from "lumi-cli/dist/lib/common/types";
import IPCEvents from "../../src/context/events";

export default class IPC {
  static socket: SocketIOClient.Socket;

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

      IPC.socket = await API.RoomRequest.joinRoom(roomId, sourceFolderPath);

      // Tell the server we would like to join.
      IPC.socket.on(
        Events.room_file_change_res,
        async (fileEventRequest: FileEventRequest) => {
          if (fileEventRequest.change.event === FileEvent.FILE_MODIFIED) {
            console.log(`File patched: ${fileEventRequest.change.path}`);
          } else {
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
      const list = allLogs.logs
        .map(
          (v) =>
            `> ${v.event}, ${new Date(v.date).toLocaleString()} in room ${
              v.roomId
            } by ${v.byWhom?.username || "unknown"}`
        )
        .join("\n");

      return list;
    });
  }
}
