import React, { Component } from "react";
import { Button, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { CrownFilled } from "@ant-design/icons";
import FormItem from "antd/lib/form/FormItem";
import { ProfilePicture } from "../image/profile-picture";
import Form from "antd/lib/form/Form";

interface IProps {
  //userData: any;
  name: string;
  log: string;
  fileLocation: string;
  lastEdit: string;
  isHost: boolean;
  profilePictureSource: any;
}
interface IState {}

const layout = {
  labelCol: { span: 3 }, //Offset from left side of the screen.
};

export default class UserOverview extends Component<IProps, IState> {
  user_Kick = () => {
    console.log("Oh no! I've been kicked.");
  };

  render() {
    return (
      <div className="container">
        <Form {...layout}>
          <FormItem style={{ textAlign: "center" }}>
            <ProfilePicture
              size={120}
              image={this.props.profilePictureSource}
              alt="Profile Picture"
            ></ProfilePicture>
            <h1 style={{ marginTop: "1em" }}>
              {this.props.name} {this.props.isHost ? <CrownFilled /> : ""}{" "}
            </h1>
          </FormItem>

          <FormItem label="Last edit:">
            <Input
              disabled={true}
              placeholder="File Location"
              value={this.props.fileLocation}
            />
          </FormItem>

          {/*
          <FormItem>
            <p> Time Edited: </p>
            <h4> {this.props.lastEdit} </h4>
          </FormItem>
          */}

          <FormItem label="Log:">
            <TextArea rows={10} disabled={true} value={this.props.log} />
          </FormItem>

          {/*
          <FormItem {...tailLayout}>
            <Button onClick={this.user_Kick} type="primary">
              Kick{" "}
            </Button>
          </FormItem>
          */}
        </Form>
      </div>
    );
  }
}
