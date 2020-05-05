import React, { Component } from "react";
import { Input } from "antd";
import "./main-page.scss";
import Popup from "src/components/popup/popup";

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
      </div>
    );
  }
}
