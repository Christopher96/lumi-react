import React, { Component } from "react";
import { Row, Col, Input } from "antd";
import "./settings-components.scss";

interface IProps {}
interface IState {}

export default class SystemSettings extends Component<IProps, IState> {
  render() {
    return (
      <div>
        <Row>
          <Col span={10}>Default project directory:</Col>
          <Col span={14}>
            <Input placeholder="default size" />
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={10}>Default project directory:</Col>
          <Col span={14}>
            <Input placeholder="default size" />
          </Col>
        </Row>
      </div>
    );
  }
}
