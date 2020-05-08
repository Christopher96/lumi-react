import React, { Component } from "react";
import "./room-folder-page.scss";
import DirectoryTree from "antd/lib/tree/DirectoryTree";
import { Button, Tooltip, Col, Row } from "antd";
import {
  UserAddOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import Paths from "../paths";

const treeData = [
  {
    title: "lumi_client",
    key: "0",
    children: [
      { title: "env", key: "0-0", isLeaf: true },
      {
        title: "src",
        key: "0-1",
        isLeaf: false,
        children: [
          { title: "index.html", key: "0-1-0", isLeaf: true },
          { title: "index.css", key: "0-1-1", isLeaf: true },
        ],
      },
    ],
  },
  {
    title: "lumi_server",
    key: "1",
    children: [
      { title: "leaf 1-0", key: "1-0", isLeaf: true },
      { title: "leaf 1-1", key: "1-1", isLeaf: true },
    ],
  },
];

interface IProps {}
interface IState {}

export default class RoomFolderPage extends Component<IProps, IState> {
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
    return (
      <>
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
