import React, { Component } from "react";
import { Tree } from "antd";

import { Button, Tooltip, Row, Card, Avatar } from "antd";
import {
  UserAddOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  UserOutlined
} from "@ant-design/icons";
import Paths from "../paths";
import TopBar from "src/components/topbar/top-bar";
import LumiContext from "src/context/lumi-context";
import IPC from "src/context/ipc";
import { Redirect } from "react-router-dom";

import "./room-page.scss";
import Meta from "antd/lib/card/Meta";
import { UserData } from "src/context/interfaces";
import { AddIconsToTree } from "./add-icons-to-tree";

interface IProps {}
interface IState {
  treeData: any;
  users: any[];
  logs: any;
}

export default class RoomFolderPage extends Component<IProps, IState> {
  static contextType = LumiContext;

  state: IState = {
    treeData: [],
    users: [],
    logs: []
  };

  componentDidMount() {
    if (!this.context.connected) return;

    this.context.update({
      title: "Room"
    });

    IPC.updateFolder((treeData: any) => {
      IPC.fetchSingleLog(this.context.room.roomId, 1).then(logs => {
        this.setState({
          logs: [...logs, ...this.state.logs]
        });
      });

      this.setState({
        treeData
      });
    });

    IPC.fetchFolder(this.context.room.source).then(treeData => {
      this.setState({
        treeData
      });
    });

    IPC.updateUsers((users: [UserData]) => {
      this.setState({
        users
      });
    });

    IPC.fetchUsers(this.context.room.roomId).then((users: [UserData]) => {
      this.setState({
        users
      });
    });

    IPC.fetchSingleLog(this.context.room.roomId, 100).then(logs => {
      this.setState({
        logs
      });
    });
  }

  openInvite() {
    IPC.openInvite();
  }

  openLogs() {
    IPC.openLogs();
  }

  openLeave() {
    IPC.openLeave();
  }

  bottomMenuButtons = (
    <Row className="bottom-menu">
      <Tooltip title="Invite" className="tooltip">
        <Button
          size="large"
          onClick={this.openInvite}
          type="primary"
          shape="circle"
          icon={<UserAddOutlined />}
        />
      </Tooltip>
      <Tooltip title="Log" className="tooltip">
        <Button
          size="large"
          onClick={this.openLogs}
          type="primary"
          shape="circle"
          icon={<FileTextOutlined />}
        />
      </Tooltip>
      <Tooltip title="Leave" className="tooltip">
        <Button
          size="large"
          onClick={this.openLeave}
          type="primary"
          shape="circle"
          icon={<ArrowRightOutlined />}
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

  makeUser = (user: any) => {
    return (
      <div className="userItem">
        <Card>
          <Meta
            avatar={
              <Avatar
                icon={
                  user.avatar ? (
                    <img alt="avatar" src={user.avatar} />
                  ) : (
                    <UserOutlined />
                  )
                }
              />
            }
            title={user.username}
            description={user.id}
          />
        </Card>
      </div>
    );
  };

  render() {
    const { users, treeData, logs } = this.state;
    const changes: { path: string; user: string }[] = logs.filter(
      (v: { event: string }) => v.event === "FILE_MANIPULATIION"
    );
    console.log(users);

    const realTree = new AddIconsToTree().make(treeData, list => {
      const changeIndex = changes.findIndex(v => v.path === list.join("/"));

      if (changeIndex === -1) return undefined;
      else {
        const change = changes[changeIndex];
        // Finds the user which
        const user = users.find(v => v.username === change.user);
        return <p style={{ fontSize: "4px" }}>{changes[changeIndex].user}</p>;
      }
    });

    return !this.context.connected ? (
      <Redirect to={Paths.START} />
    ) : (
      <>
        <TopBar />
        <div className="users">{users.map(this.makeUser)}</div>
        <div className="container">
          <Tree
            showLine
            showIcon
            defaultExpandedKeys={["0-0-0"]}
            treeData={realTree as any}
            onSelect={this.onSelect}
          />
          {this.bottomMenuButtons}
        </div>
      </>
    );
  }
}
