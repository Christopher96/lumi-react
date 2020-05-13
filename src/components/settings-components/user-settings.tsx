import React, { Component } from "react";
import { Form, Input, Button, message, Row, Avatar } from "antd";
import "./settings-components.scss";
import { FolderOutlined, UserOutlined } from "@ant-design/icons";
import IPC from "src/context/ipc";
import { IConfig } from "lumi-cli/dist/lib/utils/Config";
import { ProfilePicture } from "../image/profile-picture";

const { Search } = Input;

interface IProps {}

export default class UserSettings extends Component<IProps, IConfig> {
  private form: any = React.createRef();

  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
    };
  }

  componentDidMount() {
    IPC.fetchSettings().then((config: IConfig) => {
      this.setState(config);
    });
  }

  selectAvatar = () => {
    IPC.selectAvatar().then((path) => {
      this.form.current.setFieldsValue({
        avatar: path,
      });
    });
  };

  deselectAvatar = () => {
    this.form.current.setFieldsValue({
      avatar: null,
    });
    this.setState({ avatar: undefined });
  };

  onFinish = (values: any) => {
    IPC.saveSettings(values.avatar, values.username)
      .then((config: IConfig) => {
        this.setState(config);
        message.success("Changes saved!");
      })
      .catch(() => {
        message.error("Check that the avatar path is correct");
      });
  };

  onFinishFailed = () => {
    message.error("Could not save user settings");
  };

  render() {
    return (
      <div>
        <Row>
          <ProfilePicture image={this.state.avatar} size={128} alt="profile" />
          <Button onClick={this.deselectAvatar}>Remove</Button>
        </Row>

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
            rules={[{ message: "Please input your username!" }]}
          >
            <Input placeholder={this.state.username} />
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
