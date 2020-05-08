import React, { Component } from "react";
import "./room-folder-page.scss";
import DirectoryTree from "antd/lib/tree/DirectoryTree";
import { Button, Tooltip, Row } from "antd";
import {
  UserAddOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import Paths from "../paths";
import TopBar from "src/components/topbar/top-bar";
import LumiContext from "src/context/lumi-context";
import IPC from "src/context/ipc";
import { Redirect } from "react-router-dom";

interface IProps {}
interface IState {}

export default class RoomFolderPage extends Component<IProps, IState> {
  static contextType = LumiContext;

  componentDidMount() {
    this.context.update({
      title: "Room",
    });

    IPC.fetchFolder(this.context.source).then((treeData) => {
      this.context.update({
        treeData,
      });
    });
  }
  bottomMenuButtons = (
    <Row className="bottom-menu">
      <Tooltip title="Invite" className="tooltip">
        <Button
          type="primary"
          shape="circle"
          icon={<UserAddOutlined />}
          href={Paths.INVITE}
        />
      </Tooltip>
      <Tooltip title="Log" className="tooltip">
        <Button
          type="primary"
          shape="circle"
          icon={<FileTextOutlined />}
          href={Paths.SERVER_LOG}
        />
      </Tooltip>
      <Tooltip title="Leave" className="tooltip">
        <Button
          type="primary"
          shape="circle"
          icon={<ArrowRightOutlined />}
          href={Paths.LEAVE}
        />
      </Tooltip>
    </Row>
  );

  onSelect = (keys: any, event: any) => {
    //alert("Trigger Select" + keys + event);
  };

  onExpand = () => {
    //alert("Trigger Expand");
  };

  render() {
    const { treeData } = this.context;

    return !this.context.connected ? (
      <Redirect to={Paths.START} />
    ) : (
      <>
        <TopBar />
        <DirectoryTree
          multiple
          defaultExpandAll
          onSelect={this.onSelect}
          onExpand={this.onExpand}
          treeData={treeData}
        />
        {this.bottomMenuButtons}
      </>
    );
  }
}
