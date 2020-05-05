import React, { Component } from "react";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Input } from "antd";

const { ipcRenderer } = window.require("electron");

interface IProps {}
interface IState {
  selectedPath: string;
}

export default class CreateComponent extends Component<IProps, IState> {
  state = {
    selectedPath: "",
  };

  selectDir = () => {
    ipcRenderer.invoke("select-dir").then((res: any) => {
      this.setState({
        selectedPath: res,
      });
    });
  };

  render() {
    return (
      <>
        <Input
          size="large"
          onClick={this.selectDir}
          value={this.state.selectedPath}
          placeholder="Select a folder..."
          suffix={<FolderOpenOutlined />}
        />
      </>
    );
  }
}
