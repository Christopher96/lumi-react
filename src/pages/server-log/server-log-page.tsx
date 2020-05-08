import React, { Component } from "react";
import "./server-log-page.scss";
import ServerLogComponent from "src/components/server-log/server-log-component";

interface IProps {}
interface IState {}

export default class ServerLogPage extends Component<IProps, IState> {
  render() {
    return (
      <>
        <ServerLogComponent />
      </>
    );
  }
}
