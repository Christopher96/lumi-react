import React, { Component } from "react";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Input, Button, Row, Col } from "antd";
import IPCEvents from "src/events";
import LumiContext from "src/context/lumi-context";
import FormItem from "antd/lib/form/FormItem";
import Form from "antd/lib/form/Form";

const { Search } = Input;
const { ipcRenderer } = window.require("electron");

interface IProps {}
interface IState {}

export default class CreateComponent extends Component<IProps, IState> {
  static contextType = LumiContext;

  form: any = React.createRef();

  componentDidMount() {
    this.context.update({
      title: "Create room",
    });
  }

  selectDir = () => {
    ipcRenderer.invoke(IPCEvents.SELECT_DIR).then((res: any) => {
      this.form.current.setFieldsValue({
        source: res,
      });
    });
  };

  createRoom = (source: string) => {
    ipcRenderer
      .invoke(IPCEvents.CREATE_ROOM, source)
      .then((res: any) => {
        console.log(res);
      })
      .catch((e: any) => {
        console.error(e);
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
