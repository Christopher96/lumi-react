import React, { Component } from "react";
import { Cascader, Row, Form, message, Button } from "antd";
import "./settings-components.scss";
import { IConfig } from "lumi-cli/dist/lib/utils/Config";
import IPC from "src/context/ipc";

interface IProps {}

const options = [
  {
    value: "Lumi_01",
    label: "Lumi Default",
  },
  {
    value: "Lumi_dark_01",
    label: "Lumi Dark",
  },
];

export default class InterfaceSettings extends Component<IProps, IConfig> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
      notifyFileChange: false,
      notifyFileError: false,
      notifyUserJoin: false,
      notifyUserLeave: false,
      theme: "Lumi_01",
    };
  }

  componentDidMount() {
    IPC.fetchSettings().then((config: IConfig) => {
      this.setState(config);
    });
  }

  onFinish = (values: any) => {
    IPC.saveInterfaceSettings(values)
      .then((config: IConfig) => {
        this.setState(config);
        message.success("Changes saved!");
      })
      .catch((err) => {
        message.error("Could not save interface settings!");
      });
  };

  onFinishFailed = () => {
    message.error("Could not save interface settings!");
  };

  render() {
    return (
      <div>
        <Row>
          <h1>Interface settings (under construction)</h1>
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
          <Form.Item name="theme" label="Select a theme">
            <Cascader
              options={options}
              placeholder={
                options.find((e) => e.value === this.state.theme)?.label
              }
            />
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
