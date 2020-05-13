import React, { Component } from "react";
import { Cascader, Row, Col } from "antd";
import "./settings-components.scss";

interface IProps {}
interface IState {}

const options = [
  {
    value: "Lumi_01",
    label: "Lumi Default",
  },
  {
    value: "Lumi_dark_01",
    label: "Lumi Dark",
  },
  {
    value: "Lumi_classic_01",
    label: "Lumi Classic",
  },
  {
    value: "Lumi_extra_02",
    label: "Luminosity",
  },
  {
    value: "Ubuntu_01",
    label: "Ubuntu Ambience",
  },
];

export default class InterfaceSettings extends Component<IProps, IState> {
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
          <h1>Interface settings</h1>
        </Row>
        <Row>
          <Col span={10}>Application theme:</Col>
          <Col span={14}>
            <Cascader options={options} placeholder="Please select" />
          </Col>
        </Row>   
      </div>
    );
  }
}
