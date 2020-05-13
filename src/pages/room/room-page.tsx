import React, { Component } from "react";
import { Button, Tooltip, Row, Card, Avatar, Tree } from "antd";
import {
  UserAddOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Paths from "../paths";
import TopBar from "src/components/topbar/top-bar";
import LumiContext from "src/context/lumi-context";
import IPC from "src/context/ipc";
import { Redirect } from "react-router-dom";

import "./room-page.scss";
import Meta from "antd/lib/card/Meta";

interface IProps {}
interface IState {
  treeData: any;
  users: any;
}

export default class RoomFolderPage extends Component<IProps, IState> {
  static contextType = LumiContext;

  state = {
    treeData: [],
    users: [],
  };

  treeData2 = [
    {
      title: "parent 1",
      key: "0-0",
      icon: <> </>,
      children: [
        {
          title: "leaf",
          key: "0-0-0",
          icon: <> </>,
        },
        {
          title: "leaf.txt",
          key: "0-0-1",
          icon: <Avatar className="smallAvatar" icon={<UserOutlined />} />,
        },
      ],
    },
  ];
  /*
  applyAvatars = (treeData: any, path: string, avatar: any) => {
    console.log("apply avatars");
    const pathTest = "";
    avatar = 
  };*/

  componentDidMount() {
    if (!this.context.connected) return;

    this.context.update({
      title: "Room",
    });

    IPC.updateFolder((treeData: any) => {
      this.setState({
        treeData,
      });
    });

    console.log(this.context);
    IPC.fetchFolder(this.context.room.source).then((treeData) => {
      this.setState({
        treeData,
      });
    });

    /*
    IPC.updateUsers((users: [UserData]) => {
      this.setState({
        users,
      });
    });

    IPC.fetchUsers(this.context.room.roomId).then((users: [UserData]) => {
      this.setState({
        users,
      });
    });
     */
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
    const { users, treeData } = this.state;

    return !this.context.connected ? (
      <Redirect to={Paths.START} />
    ) : (
      <>
        <TopBar />
        <div className="users">{users.map(this.makeUser)}</div>
        <div className="container">
          <Tree
            defaultExpandAll
            showIcon
            showLine
            onSelect={this.onSelect}
            onExpand={this.onExpand}
            treeData={treeData}
          />
          {this.bottomMenuButtons}
        </div>
      </>
    );
  }
}
