const electron = require("electron");
const { ipcMain, dialog } = electron;
const { API } = require("lumi-cli/dist/api/API");
const { FS } = require("lumi-cli/dist/lib/common/FS");
const commands = require("lumi-cli/dist/commands");

function init(mainWindow) {
  ipcMain.handle("select-dir", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });
    return result.filePaths[0];
  });

  ipcMain.handle("create-room", async (_, path) => {
    const buffer = await FS.zip(path);
    const serverResponse = await API.RoomRequest.create(buffer);
    return serverResponse;
  });
}

module.exports = init;
