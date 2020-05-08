import React, { Component } from "react";
import { Button } from "antd";
import "./main-page.scss";

import Popup from "src/components/popup/popup";
import UserOverview from "src/components/user-overview/user-overview";
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
        <UserOverview name={"Name"} log={"None"} fileLocation={"The Computer"} lastEdit={"Yesterday"} isHost={true} profilePictureSource={null} />
        <Button onClick={this.onClick}>Popup</Button>
      </div>
    );
  }
}
