import Paths from "../../src/pages/paths";
import { dialog, Menu, MenuItem, BrowserWindow } from "electron";
import IPCEvents from "../../src/context/ipc-events";

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

  const navItem: MenuItem = new MenuItem({
    label: "Navigate",
    submenu,
  });

  const devItem: MenuItem = new MenuItem({
    label: "Dev",
    submenu: [
      {
        label: "Dialog",
        click() {
          dialog.showOpenDialog({
            properties: ["openFile", "multiSelections"],
          });
        },
      },
    ],
  });

  menu.append(navItem);
  menu.append(devItem);
  Menu.setApplicationMenu(menu);
};

export default navMenu;
