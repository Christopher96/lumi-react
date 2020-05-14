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
import { ProfilePicture } from "../../components/image/profile-picture";

interface IProps {}
interface IState {
  treeData: any;
  users: any[];

  // File Path => Socket id
  fileMap: Record<string, string>;
}

export default class RoomFolderPage extends Component<IProps, IState> {
  static contextType = LumiContext;

  state: IState = {
    treeData: [],
    users: [],
    fileMap: {}
  };

  componentDidMount() {
    if (!this.context.connected) return;

    this.context.update({
      title: `Room ${this.context.room.roomId}`
    });

    IPC.updateFolder(({ treeData, fileMap }: any) => {
      this.setState({
        treeData,
        fileMap: fileMap.roomMap
      });
    });

    IPC.fetchFolder(this.context.room.source, this.context.room.roomId).then(
      ({ treeData, fileMap }: any) => {
        this.setState({
          treeData,
          fileMap: fileMap.roomMap
        });
      }
    );

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
  }

  openInvite() {
    IPC.openInvite();
  }

  openLogs() {
    IPC.openLogs();
  }
  openLeave = () => {
    IPC.leaveRoom().then((leave: boolean) => {
      if (!leave) return;

      this.context.update({
        connected: false
      });
    });
  };

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

  makeUser = (user: any, key: number) => {
    return (
      <div key={key} className="userItem">
        <Card>
          <Meta
            avatar={
              <Avatar
                icon={
                  user.avatar ? (
                    <ProfilePicture
                      size={40}
                      alt="avatar"
                      image={user.avatar}
                    />
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
    const { users, treeData, fileMap } = this.state;

    const realTree = new AddIconsToTree().make(treeData, filePath => {
      filePath = filePath.filter(v => v !== ".shadow");
      const userId = fileMap[filePath.join(",")];
      const user = users.find(v => v.id === userId);

      return <ProfilePicture size={15} alt="avatar" image={user?.avatar} />;
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
