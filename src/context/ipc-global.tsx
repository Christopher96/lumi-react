import React, { Component } from "react";
import LumiContext from "./lumi-context";
import IPCEvents from "./ipc-events";

const { ipcRenderer } = window.require("electron");

interface IProps {
  history: any;
}
interface IState {}

export default class IPCGlobal extends Component<IProps, IState> {
  static contextType = LumiContext;

  componentDidMount() {
    ipcRenderer.invoke(IPCEvents.CHECK_CONNECTION, (connected: boolean) => {
      this.context.update({
        connected,
      });
    });

    ipcRenderer.on(IPCEvents.FOLDER_UPDATE, (_: any, treeData: any) => {
      this.context.update({
        treeData,
      });
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
