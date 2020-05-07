import React, { Component } from "react";
import { Row, Col } from "antd";
import "./settings-components.scss";

interface IProps {}
interface IState {}

export default class HelpSettings extends Component<IProps, IState> {
  state = {
    value: 100,
  };

  onChange = (value: number) => {
    console.log("changed", value);
  };

  render() {
    return (
      <div>
        <Row>
          <Col span={10}>Maybe we should't have a help setting</Col>
        </Row>
        <Row>
          <Col span={10}>Report bugs</Col>
        </Row>
        <Row>
          <Col span={10}>FAQ</Col>
        </Row>
        <Row>
          <Col span={10}>URL to command instructions</Col>
        </Row>
      </div>
    );
  }
}
