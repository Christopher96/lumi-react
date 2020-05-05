const electron = require("electron");
const { ipcMain, dialog } = electron;

function init(mainWindow) {
  ipcMain.handle("select-dir", async (event, ...arg) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });
    return result.filePaths[0];
  });
}

module.exports = init;
