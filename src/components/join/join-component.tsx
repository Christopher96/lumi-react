import React, { Component } from "react";
import { Input, Button, Col, Row } from "antd";
import { FolderOutlined } from "@ant-design/icons";
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import IPC from "src/context/ipc";
import LumiContext from "src/context/lumi-context";

const { Search } = Input;

interface IProps {}
interface IState {}

export default class JoinComponent extends Component<IProps, IState> {
  static contextType = LumiContext;

  form: any = React.createRef();

  selectDir = () => {
    IPC.selectDir().then((path) => {
      this.form.current.setFieldsValue({
        source: path,
      });
    });
  };

  onFinish = (values: any) => {
    if (this.context.loading || this.context.connected) return;
    console.log(values);

    this.context.update({
      connected: false,
      loading: true,
    });

    let connected = false;

    IPC.joinRoom(values.roomID, values.source)
      .then(() => {
        connected = true;
      })
      .catch(() => {
        connected = false;
      })
      .finally(() => {
        this.context.update({
          connected,
          loading: false,
        });
      });
  };

  onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    const { connected, loading } = this.context;

    return (
      <>
        <Row style={{ marginTop: "2em" }} justify="start">
          <Col span={4}></Col>
          <Col span={16}>
            <Form
              ref={this.form}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              <FormItem
                name="roomID"
                rules={[
                  { required: true, message: "You need to enter a room ID" },
                ]}
              >
                <Input placeholder="Enter a room ID..." />
              </FormItem>
              <FormItem
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
              <FormItem>
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
          <Col span={4}></Col>
        </Row>
      </>
    );
  }
}
