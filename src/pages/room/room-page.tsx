import React, { Component } from "react";
import DirectoryTree from "antd/lib/tree/DirectoryTree";
import { Button, Tooltip, Row, Card, Avatar, Drawer } from "antd";
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
import { UserData } from "src/context/interfaces";
import UserOverview from "src/components/user-overview/user-overview";

interface IProps {}
interface IState {
  treeData: any;
  users: any;
  userOverviewVisible: boolean;
}

export default class RoomFolderPage extends Component<IProps, IState> {
  static contextType = LumiContext;

  state = {
    treeData: [],
    users: [],
    userOverviewVisible: false,
  };

  componentDidMount() {
    if (!this.context.connected) return;

    this.context.update({
      title: `Room ${this.context.room.roomId}`,
    });

    IPC.updateFolder((treeData: any) => {
      this.setState({
        treeData,
      });
    });

    IPC.fetchFolder(this.context.room.source).then((treeData) => {
      this.setState({
        treeData,
      });
    });

    
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

  showDrawer = () => {
    this.setState({userOverviewVisible: true});
    console.log("Hello World");
  };

  closeDrawer = () => {
    this.setState({userOverviewVisible: false});
  };

  makeUser = (user: any, key: number) => {
    return (
      <div key={key} className="userItem">
        <Card onClick={() => this.showDrawer}>
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

        <Drawer width={640} placement="right" closable={false} onClose={this.closeDrawer} visible={this.state.userOverviewVisible}>
          <UserOverview
            name={"Name"}
            log={"None"}
            fileLocation={"The Computer"}
            lastEdit={"Yesterday"}
            isHost={true}
            profilePictureSource={null}
          />
        </Drawer>

        <TopBar />
        <div className="users">{users.map(this.makeUser)}</div>
        <div className="container">
          <DirectoryTree
            multiple
            defaultExpandAll
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
