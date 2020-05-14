import React, { Component } from "react";
import { Button, Input, Avatar } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { CrownFilled } from "@ant-design/icons";
import FormItem from "antd/lib/form/FormItem";

interface IProps {
  name: string;
  log: string;
  fileLocation: string;
  lastEdit: string;
  isHost: boolean;
  profilePictureSource: any;
}
interface IState {}

const layout = {
  labelCol: { span: 12 }, //Offset from left side of the screen.
  wrapperCol: { span: 8 }, //Size of element container.
};

const tailLayout = {
  wrapperCol: { offset: 10, span: 16 },
};

export default class CreateComponent extends Component<IProps, IState> {
  user_Kick = () => {
    console.log("Oh no! I've been kicked.");
  };

  render() {
    return (
      <>
        <form {...layout}>
          <FormItem {...tailLayout}>
            <Avatar
              shape="circle"
              size={95}
              alt="Profile Picture"
              src={this.props.profilePictureSource}
            />
          </FormItem>

          <FormItem {...tailLayout}>
            <h1> {this.props.name} {this.props.isHost ? <CrownFilled /> : ""} </h1>
          </FormItem>

          <FormItem>
            <p> Last File Edited: </p>
            <Input
              disabled={true}
              placeholder="File Location"
              value={this.props.fileLocation}
            />
          </FormItem>

          <FormItem>
            <p> Time Edited: </p>
            <h4> {this.props.lastEdit} </h4>
          </FormItem>

          <FormItem>
            <p> Patch: </p>
            <TextArea rows={10} disabled={true} value={this.props.log} />
          </FormItem>

          <FormItem  {...tailLayout}>
            <Button onClick={this.user_Kick} type="primary">
              Kick{" "}
            </Button>
          </FormItem>
        </form>
      </>
    );
  }
}
