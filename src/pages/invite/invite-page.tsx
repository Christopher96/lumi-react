import React, { Component } from "react";
import { Input, Row, Col } from "antd";
import "./invite-page.scss";

import { Button } from "antd";

interface IProps {}
interface IState {
  roomID: string;
}

export default class InvitePage extends Component<IProps, IState> {
  state = {
    roomID: "1802471964798179042168",
  };

  onCopy = () => {
    alert("to add some copy to clipboard feature");
  };
  onLink = () => {
    alert("to add some link stuff here");
  };
  //<img src="/lumi_fisk02.gif" />
  render() {
    const { roomID } = this.state;
    return (
      <div className="center">
        <h2>Session ID:</h2>
        <Input placeholder={roomID} />
        <div>
          <h3>Warning</h3>
        </div>

        <p>
          Anyone with the session ID can join the session and introduce changes.
        </p>
        <p>
          Make sure to keep your session ID secret from the rest of the internet
          to keep your work safe.
        </p>

        <Row>
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
    );
  }
}
