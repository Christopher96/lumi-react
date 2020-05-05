import React, { Component } from "react";
import { Upload, Button, Input } from "antd";
import { UploadProps } from "antd/lib/upload";
import { FolderOpenOutlined } from "@ant-design/icons";

interface IProps {}
interface IState {}

export default class CreateComponent extends Component<IProps, IState> {
  uploadProps: UploadProps = {
    name: "file",
    directory: true,
    showUploadList: false,
    onChange(e) {
      window.console.log(e);
    },
  };

  onChange = (e: any) => {
    console.log(e);
  };

  render() {
    const config = {
      directory: "",
      webkitdirectory: "",
    };
    return (
      <>
        <input {...config} onInput={this.onChange} type="file" />
      </>
    );
  }
}
