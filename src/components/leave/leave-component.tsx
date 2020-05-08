import React, { Component } from "react";
import { Row, Button } from "antd";

interface IProps {}
interface IState {}

export default class LeaveComponent extends Component<IProps, IState> {
  render() {
    console.log(process.env);
    return (
      <div>
        <Row>
          <h2 className="center-text">Leave Room?</h2>
        </Row>
        <Row>
          <Button>Leave</Button>
          <Button danger>Close room for all</Button>
        </Row>
      </div>
    );
  }
}
