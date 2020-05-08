import IPCEvents from "./events";

const { ipcRenderer } = window.require("electron");

export default class IPCListener {
  constructor(private context: any, private history: any) {
    this.register();
  }

  register = () => {
    ipcRenderer.on(IPCEvents.NAVIGATE, (_: any, route: string) => {
      this.history.push(route);
    });

    ipcRenderer.on(IPCEvents.DISCONNECTED, () => {
      this.context.update({
        connected: false,
      });
      this.history.push("/start");
    });
  };
}
