import Paths from "../../src/pages/paths";
import IPCEvents from "../../src/context/ipc-events";

const { Menu, MenuItem } = require("electron");

const navMenu = (win: any): any => {
  const menu = Menu.getApplicationMenu();

  const submenu: any = [];
  for (let [key, value] of Object.entries(Paths)) {
    submenu.push({
      label: key,
      click() {
        // TODO respond on react side and redirect
        win.webContents.send(IPCEvents.NAVIGATE, value);
      },
    });
  }

  const navItem = new MenuItem({
    label: "Navigate",
    submenu,
  });

  menu.append(navItem);
  Menu.setApplicationMenu(menu);
};

export default navMenu;
