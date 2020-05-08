import React, { Component } from "react";
import { Button, Timeline, message } from "antd";
import IPC from "src/context/ipc";

interface IProps {}
interface IState {
  timestamp: string;
  logs: any;
}

const key = "updatable";

export default class ServerLogComponent extends Component<IProps, IState> {
  state = { timestamp: "2020-01-01", logs: [["a", "b", "c"]] };

  val1 = [
    "2020-01-01 20:20:0:0",
    "hej jag heter Michael och kan skriva massa logs i en string",
  ];
  val2 = ["2020-01-01 20:20:0:0", "hej jag testar skriva"];
  val3 = ["2020-01-01 20:20:0:0", "hej äter mat"];
  testTree = [this.val1, this.val2, this.val3, this.val1, this.val3];

  componentDidMount = () => {
    IPC.fetchLogs(10).then((fetchedLogs) => {
      this.setState({
        logs: fetchedLogs,
      });
    });
  };

  makeLog = (time: string, text: string, index: number) => {
    return (
      <Timeline.Item key={index} label={time}>
        {text}
      </Timeline.Item>
    );
  };

  onExport = () => {
    message.loading({ content: "Exporting...", key });
    setTimeout(() => {
      message.success({ content: "Exported!", key, duration: 2 });
    }, 1000);
  };

  render() {
    const { logs } = this.state;
    return (
      <>
        <h2>Server Log:</h2>
        <div className="log-window">
          <Timeline mode="left">
            {logs.map((element, index) => {
              return this.makeLog(element[0], element[1], index);
            })}
          </Timeline>
        </div>
        <div className="footer">
          <Button onClick={this.onExport}>Export Log</Button>
        </div>
      </>
    );
  }
}
