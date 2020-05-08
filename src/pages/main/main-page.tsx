import React, { Component } from "react";
import { Button } from "antd";
import "./main-page.scss";
import IPC from "src/context/ipc";

interface IProps {}
interface IState {}

export default class MainPage extends Component<IProps, IState> {
  onClick = () => {
    IPC.openSettings();
  };
  render() {
    return (
      <div className="center">
        <Button onClick={this.onClick}>Popup</Button>
      </div>
    );
  }
}
