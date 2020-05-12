import React, { Component } from "react";
import LumiContext from "./lumi-context";
import IPCEvents from "./ipc-events";
import { RoomData } from "./interfaces";
import { withRouter } from "react-router";
import IPC from "./ipc";

const { ipcRenderer } = window.require("electron");

interface IProps {
  history: any;
  location: any;
  match: any;
}
interface IState {}

class IPCGlobal extends Component<IProps, IState> {
  static contextType = LumiContext;

  componentDidMount() {
    ipcRenderer
      .invoke(IPCEvents.CHECK_CONNECTION)
      .then((room: RoomData | boolean) => {
        if (room !== false) {
          this.context.update({
            room,
            connected: true,
          });
        } else {
          this.context.update({
            connected: false,
          });
        }
      });

    ipcRenderer.on(IPCEvents.NAVIGATE, (_: any, route: string) => {
      this.props.history.push(route);
    });

    ipcRenderer.on(IPCEvents.DISCONNECTED, () => {
      this.context.update({
        connected: false,
      });
    });

    ipcRenderer.on(IPCEvents.NOTIFICATION, (title: string, body?: string) => {
      IPC.notify(title, body);
    });

    IPC.notify("hello", "hello");
  }

  render() {
    return <></>;
  }
}

const IPCGlobalWithRouter = withRouter(IPCGlobal);
export default IPCGlobalWithRouter;
