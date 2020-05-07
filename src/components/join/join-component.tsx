import React, { Component } from "react";
import { Input, Button, Col, Row } from "antd";
import IPCEvents from "src/events";
import { FolderOutlined } from "@ant-design/icons";
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";

const { Search } = Input;
const { ipcRenderer } = window.require("electron");

interface IProps {}
interface IState {}

export default class JoinComponent extends Component<IProps, IState> {
  form: any = React.createRef();

  selectDir = () => {
    ipcRenderer.invoke(IPCEvents.SELECT_DIR).then((res: any) => {
      this.form.current.setFieldsValue({
        source: res,
      });
    });
  };

  joinRoom = (roomID: string, sourceFolderPath: string) => {
    ipcRenderer
      .invoke(IPCEvents.JOIN_ROOM, roomID, sourceFolderPath)
      .then((socket: SocketIOClient.Socket) => {
        console.log(socket);
      })
      .catch((e: any) => {
        console.error(e);
      });
  };

  onFinish = (values: any) => {
    this.joinRoom(values.roomID, values.source);
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
                <Button htmlType="submit" type="primary">
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
