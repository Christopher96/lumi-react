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
    const {} = this.state;
    return (
      <div className="center">
        <div className="loadingZone">
          <img
            className="lumiShade"
            src="/lumi_loading_fisk01_shade.png"
            alt="a shadow"
          />
          <img
            className="lumiFish"
            src="/lumi_loading_fisk01.png"
            alt="a fish"
          />
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
