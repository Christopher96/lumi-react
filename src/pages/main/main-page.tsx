import React, { Component } from "react";
import { Input } from "antd";
import "./main-page.scss";
import Popup from "src/components/popup/popup";
import UserOverview from "src/components/user-overview/user-overview"

interface IProps {}
interface IState {
  btnTxt: string;
  popupVisible: boolean;
  popupMessage: string;
}

const { Search } = Input;

export default class MainPage extends Component<IProps, IState> {
  state = {
    btnTxt: "Hello",
    popupVisible: false,
    popupMessage: "",
  };

  handleClick = (message: string) => {
    this.setState({
      popupVisible: true,
      popupMessage: message,
    });
  };

  onOk = () => {
    this.setState({
      popupVisible: false,
    });
  };

  onCancel = () => {
    this.setState({
      popupVisible: false,
    });
  };

  render() {
    const { btnTxt, popupVisible, popupMessage } = this.state;
    return (
      <div className="center">
        <UserOverview name={"Name"} log={"None"} fileLocation={"The Computer"} lastEdit={"Yesterday"} isHost={true} profilePictureSource={null} />
      </div>
    );
  }
}
