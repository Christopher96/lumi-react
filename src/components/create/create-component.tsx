import React, { Component } from "react";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Input, Button, Row, Col } from "antd";
import IPCEvents from "src/context/events";
import FormItem from "antd/lib/form/FormItem";
import Form from "antd/lib/form/Form";
import LumiContext from "src/context/lumi-context";

const { Search } = Input;
const { ipcRenderer } = window.require("electron");

interface IProps {}
interface IState {}

export default class CreateComponent extends Component<IProps, IState> {
  static contextType = LumiContext;

  form: any = React.createRef();

  selectDir = () => {
    ipcRenderer.invoke(IPCEvents.SELECT_DIR).then((res: any) => {
      this.form.current.setFieldsValue({
        source: res,
      });
    });
  };

  createRoom = (source: string) => {
    if (this.context.loading || this.context.connected) return;

    this.context.update({
      loading: true,
      connected: false,
    });

    let connected = false;

    ipcRenderer
      .invoke(IPCEvents.CREATE_ROOM, source)
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

  onFinish = (values: any) => {
    this.createRoom(values.source);
  };

  onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  render() {
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
                <Button htmlType="submit" type="primary">
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
