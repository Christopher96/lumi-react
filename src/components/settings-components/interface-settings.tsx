import React, { Component } from "react";
import { Cascader, Row, Form, message, Button } from "antd";
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
  onFinish(values: any) {}

  onFinishFailed() {
    message.error("Could not save interface settings");
  }

  render() {
    return (
      <div>
        <Row>
          <h1>Interface settings</h1>
        </Row>
        <Row>
          <h2>Looks and feels</h2>
        </Row>
        <Form
          labelCol={{ span: 8 }}
          labelAlign="left"
          wrapperCol={{ span: 16 }}
          name="room_settings"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item name="theme_select" label="Select a theme">
            <Cascader options={options} placeholder="Please select" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
