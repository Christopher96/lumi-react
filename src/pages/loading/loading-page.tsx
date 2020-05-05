import React, { Component } from "react";
import { Input } from "antd";
import "./loading-page.scss";

import { Button } from "antd";

interface IProps {}
interface IState {
  btnTxt: string;
  btn: any;
}

export default class LoadingPage extends Component<IProps, IState> {
  state = {
    btnTxt: "Hello",
    btn: (
      <Button type="primary" shape="round">
        Download
      </Button>
    ),
  };

  onCancel = () => {
    console.log("managed to cancel the loading screen");
  };

  render() {
    const { btnTxt, btn } = this.state;
    return (
      <div className="center">
        <img src="/lumi_fisk02.gif" />
        <div>
          <Button
            className="bottomCenter"
            onClick={this.onCancel}
            type="primary"
            shape="round"
            href="/home"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}
