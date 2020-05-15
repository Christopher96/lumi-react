import React, { Component } from "react";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Input, Button, Row, Col, Alert } from "antd";
import FormItem from "antd/lib/form/FormItem";
import Form from "antd/lib/form/Form";
import LumiContext from "src/context/lumi-context";
import IPC from "src/context/ipc";

const { Search } = Input;

interface IProps {}
interface IState {
  error: string | boolean;
}

export default class CreateComponent extends Component<IProps, IState> {
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

    IPC.createRoom(this.context, values.source).then((res: any) => {
      if (res.error) {
        this.setState({
          error: res.error,
        });
      }
    });
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
          <Col span={4}></Col>
          <Col span={16}>
            <Form
              ref={this.form}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={this.onFinish}
            >
              {errorAlert}
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
      </div>
    );
  }
}
