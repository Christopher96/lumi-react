import Paths from "../../src/pages/paths";
import { Menu, MenuItem, BrowserWindow } from "electron";
import IPCEvents from "../../src/context/events";

const navMenu = (win: BrowserWindow): any => {
  const menu: Menu = Menu.getApplicationMenu();

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

  const menuItem: MenuItem = new MenuItem({
    label: "Navigate",
    submenu,
  });

  menu.append(menuItem);
  Menu.setApplicationMenu(menu);
};

export default navMenu;
