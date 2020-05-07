import React, { Component } from "react";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";

const { Search } = Input;
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

  createRoom = () => {
    ipcRenderer
      .invoke("create-room", this.state.selectedPath)
      .then((res: any) => {
        console.log(res);
      })
      .catch((e: any) => {
        console.error(e);
      });
  };

  render() {
    return (
      <>
        <Search
          enterButton={
            <>
              <span>Open</span>
              <FolderOpenOutlined />
            </>
          }
          placeholder="Enter a folder path..."
          value={this.state.selectedPath}
          onSearch={this.selectDir}
        />
        <Button onClick={this.createRoom} type="primary">
          Create room
        </Button>
      </>
    );
  }
}
