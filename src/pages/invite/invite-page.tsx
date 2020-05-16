import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import "./invite-page.scss";

import { Input, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import FormItem from "antd/lib/form/FormItem";
import Form from "antd/lib/form/Form";

interface IProps extends RouteComponentProps {}
interface IState {}

const { Search } = Input;

export default class InvitePage extends Component<IProps, IState> {
  input: any = React.createRef();

  onCopy = () => {
    this.input.current.input.select();
    document.execCommand("copy");
    message.success({ content: "Copied to clipboard!", duration: 2 });
  };
  onLink = () => {
    alert("to add some link stuff here");
  };

  render() {
    const id = (this.props.match.params as any).id;
    console.log(id);
    return (
      <div className="container">
        <Form>
          <FormItem>
            <div className="warning-text">
              <br />
              <div>
                <h3>Warning:</h3>
              </div>
              <p>
                Anyone with the session ID can join the session and introduce
                changes if the room is not password protected.
              </p>
            </div>
          </FormItem>
          <FormItem label="Session ID">
            <Search
              ref={this.input}
              style={{ width: "100%" }}
              enterButton={
                <>
                  <span>Copy</span>
                  <CopyOutlined />
                </>
              }
              onSearch={this.onCopy}
              value={id}
            />
          </FormItem>
        </Form>
      </div>
    );
  }
}
