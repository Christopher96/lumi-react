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

  const test = new MenuItem({
    label: "Test",
    submenu: [
      {
        label: "Popup",
        click() {
          let myNotification = new Notification("Title", {
            body: "Lorem Ipsum Dolor Sit Amet",
          });
          myNotification.onclick = () => {
            console.log("Notification clicked");
          };
        },
      },
    ],
  });

  menu.append(navItem);
  menu.append(test);
  Menu.setApplicationMenu(menu);
};

export default navMenu;
