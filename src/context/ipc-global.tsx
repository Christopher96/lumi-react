import React, { Component } from "react";
import LumiContext from "./lumi-context";
import IPCEvents from "./ipc-events";
import { Room } from "./interfaces";

const { ipcRenderer } = window.require("electron");

interface IProps {
  history: any;
}
interface IState {}

export default class IPCGlobal extends Component<IProps, IState> {
  static contextType = LumiContext;

  componentDidMount() {
    ipcRenderer
      .invoke(IPCEvents.CHECK_CONNECTION)
      .then((room: Room | boolean) => {
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
  }

  render() {
    return <></>;
  }
}
