import React, { Component } from "react";
import { PageHeader, Tag } from "antd";
import LumiContext from "src/context/lumi-context";
import "./top-bar.scss";

interface IProps {}
interface IState {}

export default class TopBar extends Component<IProps, IState> {
  static contextType = LumiContext;

  render() {
    return (
      <PageHeader
        tags={<Tag color="red">Offline</Tag>}
        className="header"
        title={this.context.title}
      ></PageHeader>
    );
  }
}
