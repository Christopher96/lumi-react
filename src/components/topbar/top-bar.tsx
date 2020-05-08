import React, { Component } from "react";
import { PageHeader, Tag } from "antd";
import LumiContext from "src/context/lumi-context";
import "./top-bar.scss";

interface IProps {}
interface IState {}

export default class TopBar extends Component<IProps, IState> {
  static contextType = LumiContext;

  render() {
    const { title, connected } = this.context;
    return (
      <PageHeader
        tags={
          <Tag color={connected ? "green" : "red"}>
            {connected ? "Online" : "Offline"}
          </Tag>
        }
        className="header"
        title={title}
      ></PageHeader>
    );
  }
}
