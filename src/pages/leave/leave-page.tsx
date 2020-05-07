import React, { Component } from "react";
import "./leave-page.scss";
import LeaveComponent from "src/components/leave/leave-component";

interface IProps {}
interface IState {}

export default class LeavePage extends Component<IProps, IState> {
  render() {
    return (
      <div className="center">
        <LeaveComponent />
      </div>
    );
  }
}
