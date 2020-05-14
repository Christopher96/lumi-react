import React, { Component } from "react";
import { Row, Switch, Form, message, Input, Button } from "antd";
import LumiContext from "src/context/lumi-context";
import Password from "antd/lib/input/Password";

interface IProps {}
interface IState {}

export default class RoomSettings extends Component<IProps, IState> {
  static contextType = LumiContext;

  onFinish(values: any) {}

  onFinishFailed() {
    message.error("Could not save room settings");
  }

  render() {
    return (
      <div>
        <Row>
          <h1>Room settings</h1>
        </Row>
        <Row>
          <h2>General</h2>
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
          <Form.Item name="notify_file_change" label="Notify file change">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item name="notify_file_error" label="Notify file error">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item name="notify_user_join" label="Notify user join">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item name="notify_user_leave" label="Notify user leave">
            <Switch defaultChecked />
          </Form.Item>

          <Row>
            <h2>Room specific</h2>
          </Row>

          <Form.Item label="Room password" name="room_password">
            <Password
              disabled={!this.context.connected}
              placeholder={
                this.context.connected
                  ? "Enter a new password"
                  : "Please join a room first"
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
