import React, { Component } from "react";
import { Input } from "antd";
import "./loading-page.scss";

import { Button } from "antd";

interface IProps {}
interface IState {}

export default class LoadingPage extends Component<IProps, IState> {
  state = {};

  onCancel = () => {
    console.log("managed to cancel the loading screen");
  };

  render() {
    return (
      <div className="center">
        <div className="loadingZone">
          <div className="lumiFish"></div>
        </div>

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
