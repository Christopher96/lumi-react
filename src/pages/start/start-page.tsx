import { Tabs } from "antd";
import React, { Component } from "react";
import "./start-page.scss";
import CreateComponent from "src/components/create/create-component";
import JoinComponent from "src/components/join/join-component";
import LumiContext from "src/context/lumi-context";
import TopBar from "src/components/topbar/top-bar";

const { TabPane } = Tabs;

interface IProps {}
interface IState {
  isCreate: boolean;
}

export default class StartPage extends Component<IProps, IState> {
  static contextType = LumiContext;

  state = {
    isCreate: true,
    selectedKeys: [],
  };

  componentDidMount() {
    this.updateTitle();
  }

  onChange = (key: string) => {
    this.setState(
      {
        isCreate: key === "1",
      },
      this.updateTitle
    );
  };

  updateTitle = () => {
    this.context.update({
      title: this.state.isCreate ? "Create room" : "Join room",
    });
  };

  render() {
    return (
      <>
        <TopBar />
        <Tabs onChange={this.onChange} type="card" defaultActiveKey="1">
          <TabPane tab={<span>Create</span>} key="1">
            <CreateComponent />
          </TabPane>
          <TabPane tab={<span>Join</span>} key="2">
            <JoinComponent />
          </TabPane>
        </Tabs>
      </>
    );
  }
}
