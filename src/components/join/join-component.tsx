import React, { Component } from "react";
import { Input, Button, Col, Row, Alert } from "antd";
import { FolderOutlined } from "@ant-design/icons";
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import IPC from "src/context/ipc";
import LumiContext from "src/context/lumi-context";

const { Search } = Input;

interface IProps {}
interface IState {
  error: string | boolean;
}

export default class JoinComponent extends Component<IProps, IState> {
  static contextType = LumiContext;

  form: any = React.createRef();

  state = {
    error: false,
  };

  selectDir = () => {
    IPC.selectDir().then((path) => {
      this.form.current.setFieldsValue({
        source: path,
      });
    });
  };

  onFinish = (values: any) => {
    if (this.context.loading || this.context.connected) return;

    this.setState({
      error: false,
    });

    IPC.joinRoom(this.context, values.roomID, values.source).then(
      (res: any) => {
        if (res.error) {
          this.setState({
            error: res.error,
          });
        }
      }
    );
  };

  onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    const { connected, loading } = this.context;
    const { error } = this.state;

    let errorAlert = error ? (
      <FormItem>
        <Alert type="error" message={error} banner />
      </FormItem>
    ) : (
      ""
    );
    return (
      <div className="container">
        <Row justify="start">
          <Col span={3}></Col>
          <Col span={18}>
            <Form
              labelCol={{ span: 3 }}
              ref={this.form}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              {errorAlert}
              <FormItem
                label="Source"
                name="source"
                rules={[
                  {
                    required: true,
                    message: "You need to select a source folder",
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
                  placeholder="Enter a folder path..."
                  onSearch={this.selectDir}
                />
              </FormItem>
              <FormItem
                label="Room ID"
                name="roomID"
                rules={[
                  { required: true, message: "You need to enter a room ID" },
                ]}
              >
                <Input placeholder="Enter a room ID..." />
              </FormItem>
              <FormItem wrapperCol={{ offset: 3 }}>
                <Button
                  disabled={connected}
                  loading={loading}
                  htmlType="submit"
                  type="primary"
                >
                  Join room
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={3}></Col>
        </Row>
      </div>
    );
  }
}
