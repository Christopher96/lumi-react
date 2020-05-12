import React, { Component } from "react";
import { Form, Input, Button, message } from "antd";
import "./settings-components.scss";
import { FolderOutlined } from "@ant-design/icons";
import IPC from "src/context/ipc";

const { Search } = Input;

interface IProps {}
interface IState {}

export default class UserSettings extends Component<IProps, IState> {
  private form: any = React.createRef();

  selectAvatar = () => {
    IPC.selectAvatar().then((path) => {
      this.form.current.setFieldsValue({
        avatar: path,
      });
    });
  };

  onFinish = (values: any) => {
    IPC.saveUserSettings(values.avatar, values.username);
    message.success(`${values.avatar} : ${values.username}`);
  };

  onFinishFailed = () => {
    message.error('Could not save user settings');
  };

  render() {
    return (
      <div>
        <Form
          name="user_settings"
          ref={this.form}
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label="Avatar"
            name="avatar"
            rules={[
              {
                required: true,
                message: "You need to select an avatar",
              },
            ]}
          >
            <Search
              enterButton={
                <>
                  <span>Open</span>
                  <FolderOutlined />
                </>
              }
              placeholder="Enter an avatar path..."
              onSearch={this.selectAvatar}
            />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
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
