import React, { Component } from "react";
import { Input } from "antd";
import "./main-page.scss";
import Popup from "src/components/popup/popup";
import InviteComponent from "src/components/invite/invite-component";

interface IProps {}
interface IState {
  btnTxt: string;
  popupVisible: boolean;
  popupMessage: string;

  inviteVisible: boolean;
}

const { Search } = Input;

export default class MainPage extends Component<IProps, IState> {
  state = {
    btnTxt: "Hello",
    popupVisible: false,
    popupMessage: "",

    inviteVisible: false,
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
      inviteVisible: true,
    });
  };

  onCancel = () => {
    this.setState({
      popupVisible: false,
    });
  };

  //Invite popup functions:
  onInviteOk = () => {
    this.setState({
      inviteVisible: false,
    });
  };

  onInviteCancel = () => {
    this.setState({
      inviteVisible: false,
    });
  };

  render() {
    const { btnTxt, popupVisible, popupMessage, inviteVisible } = this.state;
    return (
      <div className="center">
        <Popup
          title="Hello popup!"
          onOk={this.onOk}
          onCancel={this.onCancel}
          visible={popupVisible}
          message={popupMessage}
        />
        <Search
          placeholder="Enter a message..."
          enterButton={btnTxt}
          size="large"
          onSearch={this.handleClick}
        />
        <InviteComponent
          title="Invite to room"
          visible={inviteVisible}
          onOk={this.onInviteOk}
          onCancel={this.onInviteCancel}
          message={"2132141251374129749127983"}
        />
      </div>
    );
  }
}
