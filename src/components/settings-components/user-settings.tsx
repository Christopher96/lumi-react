import React, { Component } from "react";
import { Form, Input, Button, message, Row } from "antd";
import "./settings-components.scss";
import { FolderOutlined } from "@ant-design/icons";
import IPC from "src/context/ipc";
import { IConfig } from "lumi-cli/dist/lib/utils/Config";
import { ProfilePicture } from "../image/profile-picture";

const { Search } = Input;

interface IProps {}

interface IState {
  config: IConfig;
  isLoading: boolean;
}

export default class UserSettings extends Component<IProps, IState> {
  private form: any = React.createRef();

  constructor(props: any) {
    super(props);
    this.state = {
      config: {
        username: "",
        notifyFileChange: false,
        notifyFileError: false,
        notifyUserJoin: false,
        notifyUserLeave: false,
        theme: "",
      },
      isLoading: true,
    };
  }

  componentDidMount() {
    IPC.fetchSettings().then((config: IConfig) => {
      this.setState({ config });
      this.setState({ isLoading: false });
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
    const config: IConfig = this.state.config;
    config.avatar = undefined;
    this.setState({ config });
  };

  onFinish = (values: any) => {
    IPC.saveUserSettings(values.avatar, values.username)
      .then((config: IConfig) => {
        this.setState({ config });
        message.success("Changes saved!");
      })
      .catch(() => {
        message.error("Check that the avatar path is correct!");
      });
  };

  onFinishFailed = () => {
    message.error("Could not save user settings!");
  };

  render() {
    return (
      <div>
        {!this.state.isLoading && (
          <>
            <Row>
              <h1>User settings</h1>
            </Row>
            <Row>
              <h2>Profile</h2>
            </Row>
            <Row className="profile-picture-row">
              <ProfilePicture
                image={this.state.config.avatar}
                size={128}
                alt="profile"
              />
            </Row>

            <Form
              labelCol={{ span: 4 }}
              labelAlign="left"
              wrapperCol={{ span: 20 }}
              name="user_settings"
              ref={this.form}
              initialValues={{ remember: true }}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              <Form.Item label="Avatar" name="avatar">
                {this.state.config.avatar ? (
                  <Button onClick={this.deselectAvatar}>Remove Image</Button>
                ) : (
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
                )}
              </Form.Item>

              <Form.Item label="Username" name="username">
                <Input placeholder={this.state.config.username} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    );
  }
}
