import React, { Component } from "react";
import { Row } from "antd";
import LumiContext from "src/context/lumi-context";

interface IProps {}
interface IState {}

export default class RoomSettings extends Component<IProps, IState> {
    static contextType = LumiContext;
  
    render() {
    return (
      <div>
        <Row>
          <h1>Room settings</h1>
        </Row>
        {this.context.connected ? (<p>You are connected :)</p>) : (<p>You are not connected</p>)}
      </div>
    );
  }
}
