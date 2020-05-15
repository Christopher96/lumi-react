import React, { Component } from "react";

import { Button, Tooltip, Row, Card, Avatar, Drawer, Tree } from "antd";
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
import UserOverview from "src/components/user-overview/user-overview";
import { AddIconsToTree } from "./add-icons-to-tree";
import { ProfilePicture } from "../../components/image/profile-picture";

interface IProps {}
interface IState {
  treeData: any;
  users: any[];
  adminUserId?: string;
  currentOverviewUserId: string | null;
  // File Path => Socket id
  fileMap: Record<string, string>;
}

export default class RoomFolderPage extends Component<IProps, IState> {
  static contextType = LumiContext;

  state: IState = {
    treeData: [],
    fileMap: {},
    users: [],
    currentOverviewUserId: null
  };

  componentDidMount() {
    if (!this.context.connected) return;

    this.context.update({
      title: `Room ${this.context.room.roomId}`
    });

    IPC.updateFolder(({ treeData, fileMap }: any) => {
      this.setState({
        treeData,
        fileMap
      });
    });

    IPC.fetchUsers(this.context.room.roomId).then(
      (users: { user: UserData; isHost: boolean }[]) => {
        this.setState({
          users: users.map(v => v.user),
          adminUserId: users.find(v => v.isHost === true)?.user.id
        });
      }
    );

    IPC.updateUsers((users: UserData[]) => {
      this.setState({
        users
      });
    });

    IPC.fetchFolder(this.context.room.source, this.context.room.roomId).then(
      ({ treeData, fileMap }: any) => {
        this.setState({
          treeData,
          fileMap
        });
      }
    );
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

  showDrawer = (id: string) => {
    this.setState({ currentOverviewUserId: id });
  };

  closeDrawer = () => {
    this.setState({ currentOverviewUserId: null });
  };

  makeUser = (user: any, key: number) => {
    return (
      <div key={key} className="userItem">
        <Card onClick={() => this.showDrawer(user.id)}>
          <Meta
            avatar={
              <Avatar
                icon={
                  user.avatar ? (
                    <ProfilePicture
                      alt="profile image"
                      image={user.avatar}
                      size={25}
                    ></ProfilePicture>
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

  getIconTree = (treeData: any, fileMap: any, users: any[]) => {
    return new AddIconsToTree().make(treeData, filePath => {
      // We want to remove the shadow relative path if shadow is in the first index.
      filePath = filePath.filter((v, i) => !(v === ".shadow" && i === 0));
      const userId = fileMap[filePath.join(",")];
      const user = users.find(v => v.id === userId);

      return (
        <div className="change-file-user-icon">
          <ProfilePicture size={25} alt="avatar" image={user?.avatar} />
        </div>
      );
    });
  };

  render() {
    const {
      users,
      treeData,
      adminUserId,
      fileMap,
      currentOverviewUserId
    } = this.state;
    const realTree = this.getIconTree(treeData, fileMap, users);
    const currentOverviewUser =
      currentOverviewUserId && users.find(v => v.id === currentOverviewUserId);

    return !this.context.connected ? (
      <Redirect to={Paths.START} />
    ) : (
      <>
        <Drawer
          width={640}
          placement="right"
          closable={false}
          onClose={this.closeDrawer}
          visible={currentOverviewUserId !== null}
        >
          <UserOverview
            name={currentOverviewUser?.username}
            log={"Soon to be implemented"}
            fileLocation={"The Computer"}
            lastEdit={"Yesterday"}
            isHost={currentOverviewUser?.id === adminUserId}
            profilePictureSource={currentOverviewUser?.avatar}
          />
        </Drawer>

        <TopBar />
        <div className="users">{[...users].map(this.makeUser)}</div>
        <div className="container">
          <Tree
            showLine
            showIcon
            defaultExpandedKeys={["0-0-0"]}
            treeData={[...(realTree || [])] as any}
            onSelect={this.onSelect}
          />
          {this.bottomMenuButtons}
        </div>
      </>
    );
  }
}
