import React, { Component } from "react";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Input, Button, Row, Col } from "antd";
import FormItem from "antd/lib/form/FormItem";
import Form from "antd/lib/form/Form";
import LumiContext from "src/context/lumi-context";
import IPC from "src/context/ipc";

const { Search } = Input;

interface IProps {}
interface IState {}

export default class CreateComponent extends Component<IProps, IState> {
  static contextType = LumiContext;

  form: any = React.createRef();

  selectDir = () => {
    IPC.selectDir().then((path) => {
      this.form.setFieldsValue({
        source: path,
      });
    });
  };

  onFinish = (values: any) => {
    if (this.context.loading || this.context.connected) return;

    this.context.update({
      connected: false,
      loading: true,
    });

    let connected = false;

    IPC.createRoom(values.source)
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
                      <FolderOpenOutlined />
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
                  Create room
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
