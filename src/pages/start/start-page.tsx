import { Menu } from "antd";
import React, { Component } from "react";
import "./start-page.scss";
import CreateComponent from "src/components/create/create-component";
import JoinComponent from "src/components/join/join-component";
import { SelectParam } from "antd/lib/menu";

interface IProps {}
interface IState {
  isCreate: boolean;
}

export default class StartPage extends Component<IProps, IState> {
  state = {
    isCreate: true,
  };

  onSelect = (param: SelectParam) => {
    this.setState({
      isCreate: param.key === "1",
    });
  };

  render() {
    const content = this.state.isCreate ? (
      <CreateComponent />
    ) : (
      <JoinComponent />
    );

    return (
      <>
        <Menu
          onSelect={this.onSelect}
          defaultSelectedKeys={["1"]}
          mode="horizontal"
        >
          <Menu.Item key="1">Create</Menu.Item>
          <Menu.Item key="2">Join</Menu.Item>
        </Menu>
        {content}
      </>
    );
  }
}
