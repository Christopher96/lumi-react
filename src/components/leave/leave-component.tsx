import React, { Component } from "react";
import { Row, Button } from "antd";

interface IProps {}
interface IState {}

export default class LeaveComponent extends Component<IProps, IState> {
  /*leave = (
    <div className="center">
      <h2>Session ID:</h2>
      <div className="stick-to-bottom">
        <Row className="bottomButtons">
          <Col span={12}>
            <Button type="primary" block onClick={this.onCopy}>
              Copy Session ID
            </Button>
          </Col>

          <Col span={12}>
            <Button type="primary" block onClick={this.onLink}>
              Fetch Invite Link
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );*/

  render() {
    console.log(process.env);
    return (
      <div>
        <Row>
          <h2 className="center-text">Leave Room?</h2>
        </Row>
        <Row className="bottomButtons">
          <Button>Leave</Button>
          <Button danger>Close room for all</Button>
        </Row>
      </div>
    );
  }
}
