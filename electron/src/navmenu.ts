import Paths from "../../src/pages/paths";
import IPCEvents from "../../src/context/ipc-events";

const { nativeImage, dialog, Menu, MenuItem } = require("electron");

const navMenu = (win: any): any => {
  const menu = Menu.getApplicationMenu();

  const submenu: any = [];
  for (let [key, value] of Object.entries(Paths)) {
    submenu.push({
      label: key,
      click() {
        win.webContents.send(IPCEvents.NAVIGATE, value);
      },
    });
  }

  const navItem = new MenuItem({
    label: "Navigate",
    submenu,
  });

  const logo = nativeImage.createFromPath("../../src/assets/logo.png");

  const testItem = new MenuItem({
    label: "Test",
    submenu: [
      {
        label: "Question",
        click() {
          dialog.showMessageBox(win, {
            type: "question",
            title: "message",
            message: "hello hello",
            buttons: ["test1", "test2", "test3"],
            detail: "detailed message",
            checkboxLabel: "hello",
            icon: logo,
          });
        },
      },
      {
        label: "Error",
        click() {
          dialog.showErrorBox("error", "error body");
        },
      },
      {
        label: "Open",
        click() {
          dialog.showOpenDialog(win, {
            title: "Open",
            buttonLabel: "Test",
          });
        },
      },
      {
        label: "Save",
        click() {
          dialog.showSaveDialog(win, {
            title: "Save",
            buttonLabel: "Test",
          });
        },
      },
      {
        label: "Info",
        click() {
          dialog.showMessageBox(win, {
            type: "info",
            title: "message",
          });
        },
      },
      {
        label: "Warning",
        click() {
          dialog.showMessageBox(win, {
            type: "warning",
            title: "message",
          });
        },
      },
    ],
  });

  menu.append(navItem);
  menu.append(testItem);
  Menu.setApplicationMenu(menu);
};

export default navMenu;
