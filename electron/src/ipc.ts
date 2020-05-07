import { ipcMain, dialog } from "electron";
import { API } from "lumi-cli/dist/api/API";
import { FS } from "lumi-cli/dist/lib/common/FS";
import { Events } from "lumi-cli/dist/api/routes/SocketEvents";
import { FileEvent, FileEventRequest } from "lumi-cli/dist/lib/common/types";
import IPCEvents from "./events";

export default class IPC {
  static init(mainWindow: Electron.BrowserWindow) {
    ipcMain.handle(IPCEvents.SELECT_DIR, async () => {
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ["openDirectory"],
      });
      return result.filePaths[0];
    });

    ipcMain.handle(IPCEvents.CREATE_ROOM, async (_, path) => {
      const buffer = await FS.zip(path);
      const serverResponse = await API.RoomRequest.create(buffer);
      return serverResponse;
    });

    ipcMain.handle(IPCEvents.JOIN_ROOM, async (_, roomId, sourceFolderPath) => {
      const zippedRoom = await API.RoomRequest.downloadRoom(roomId);
      await FS.createShadow(sourceFolderPath, zippedRoom);

      const socket = await API.RoomRequest.joinRoom(roomId);

      // Tell the server we would like to join.
      socket.on(
        Events.room_file_change_res,
        async (fileEventRequest: FileEventRequest) => {
          if (fileEventRequest.change.event === FileEvent.FILE_MODIFIED) {
            console.log(`File patched: ${fileEventRequest.change.path}`);
          } else {
            console.log(`File changed: ${fileEventRequest.change.path}`);
          }
        }
      );

      socket.emit(Events.room_join, roomId);
    });
  }
}
