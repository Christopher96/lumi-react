import React, { Component } from "react";
import { Row, Switch, Form, message, Button } from "antd";
import { IConfig } from "lumi-cli/dist/lib/utils/Config";
import IPC from "src/context/ipc";

interface IProps {}

export default class RoomSettings extends Component<IProps, IConfig> {

  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
      notifyFileChange: false,
      notifyFileError: false,
      notifyUserJoin: false,
      notifyUserLeave: false,
      theme: "",
    };
  }

  componentDidMount() {
    IPC.fetchSettings().then((config: IConfig) => {
      this.setState(config);
    });
  }

  onFinish = (values: any) => {
    IPC.saveRoomSettings(values)
      .then((config: IConfig) => {
        this.setState(config);
        message.success("Changes saved!");
      })
      .catch((err) => {
        message.error("Could not save room settings!");
      });
  };

  onFinishFailed = () => {
    message.error("Could not save room settings!");
  };

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
          <Form.Item name="notifyFileChange" label="Notify file change">
            <Switch
              onClick={(e) => this.setState({ notifyFileChange: e.valueOf() })}
              checked={this.state.notifyFileChange}
            />
          </Form.Item>
          <Form.Item name="notifyFileError" label="Notify file error">
            <Switch
              onClick={(e) => this.setState({ notifyFileError: e.valueOf() })}
              checked={this.state.notifyFileError}
            />
          </Form.Item>
          <Form.Item name="notifyUserJoin" label="Notify user join">
            <Switch
              onClick={(e) => this.setState({ notifyUserJoin: e.valueOf() })}
              checked={this.state.notifyUserJoin}
            />
          </Form.Item>
          <Form.Item name="notifyUserLeave" label="Notify user leave">
            <Switch
              onClick={(e) => this.setState({ notifyUserLeave: e.valueOf() })}
              checked={this.state.notifyUserLeave}
            />
          </Form.Item>

         

          {/*   
          
            Uncomment this if we want to be able to change the room password

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
            </Form.Item> */}

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
