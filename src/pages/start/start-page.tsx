import { Tabs } from "antd";
import React, { Component } from "react";
import "./start-page.scss";
import CreateComponent from "src/components/create/create-component";
import JoinComponent from "src/components/join/join-component";
import { SelectParam } from "antd/lib/menu";

const { TabPane } = Tabs;

interface IProps {}
interface IState {
  isCreate: boolean;
}

export default class StartPage extends Component<IProps, IState> {
  state = {
    isCreate: true,
    selectedKeys: [],
  };

  onSelect = (param: SelectParam) => {
    this.setState({
      isCreate: param.key === "1",
    });
  };

  render() {
    return (
      <Tabs type="card" defaultActiveKey="2">
        <TabPane tab={<span>Join</span>} key="1">
          <CreateComponent />
        </TabPane>
        <TabPane tab={<span>Create</span>} key="2">
          <JoinComponent />
        </TabPane>
      </Tabs>
    );
  }
}
