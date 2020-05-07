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
    title: "parent 0",
    key: "0-0",
    children: [
      { title: "leaf 0-0", key: "0-0-0", isLeaf: true },
      {
        title: "parent 3",
        key: "0-0-9",
        isLeaf: false,
        children: [
          { title: "leaf 0-0", key: "0-0-8", isLeaf: true },
          { title: "leaf 0-1", key: "0-0-1", isLeaf: true },
        ],
      },
    ],
  },
  {
    title: "parent 1",
    key: "0-1",
    children: [
      { title: "leaf 1-0", key: "0-1-0", isLeaf: true },
      { title: "leaf 1-1", key: "0-1-1", isLeaf: true },
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
        <Button type="primary" shape="circle" icon={<FileTextOutlined />} />
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
