import React, { Component } from "react";
import { Button, Drawer } from "antd";
import "./main-page.scss";

import UserOverview from "src/components/user-overview/user-overview";
import IPC from "src/context/ipc";

interface IProps {}
interface IState {
  visible: boolean,
};

export default class MainPage extends Component<IProps, IState> {

  state = { visible: false };

  showDrawer = () => {
    this.setState({visible: true});
  };

  closeDrawer = () => {
    this.setState({visible: false});
  };

  onClick = () => {
    IPC.openSettings();
  };
  render() {
    return (
      <div className="center">

        <Drawer width={640} placement="right" closable={false} onClose={this.closeDrawer} visible={this.state.visible}>
          <UserOverview
            name={"Name"}
            log={"None"}
            fileLocation={"The Computer"}
            lastEdit={"Yesterday"}
            isHost={true}
            profilePictureSource={null}
          />
        </Drawer>

        <Button onClick={this.showDrawer}>Popup</Button>
      </div>
    );
  }
}
