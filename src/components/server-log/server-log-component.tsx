import React, { Component } from "react";
import { Row, Button, Radio, Timeline } from "antd";

interface IProps {}
interface IState {}

export default class ServerLogComponent extends Component<IProps, IState> {
  state = {};

  render() {
    return (
      <div>
        <h2>Server Log:</h2>
        <Timeline mode="left">
          <Timeline.Item label="2015-09-01">Create a services</Timeline.Item>
          <Timeline.Item label="2015-09-01 09:12:11">
            Solve initial network problems
          </Timeline.Item>
          <Timeline.Item>Technical testing</Timeline.Item>
          <Timeline.Item label="2015-09-01 09:12:11">
            Network problems being solved
          </Timeline.Item>
        </Timeline>
      </div>
    );
  }
}
