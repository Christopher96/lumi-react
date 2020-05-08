import React, { Component } from "react";
import IPC from "src/context/ipc";
import { Typography, Button, List, Avatar, message, Tooltip, Tag } from "antd";
import { ExportOutlined, UserOutlined } from "@ant-design/icons";

interface IProps {}
interface IState {
  logs: any;
}

const { Title } = Typography;

export default class ServerLogComponent extends Component<IProps, IState> {
  state = {
    logs: [],
  };

  componentDidMount = () => {
    IPC.fetchLogs(10).then((logs) => {
      console.log(logs);
      this.setState({
        logs,
      });
    });
  };

  onExport = () => {
    message.loading({ content: "Exporting..." });
    setTimeout(() => {
      message.success({ content: "Exported!", duration: 2 });
    }, 1000);
  };

  exportButton = (
    <div className="exportButtonIcon">
      <Tooltip title="Export" className="tooltip">
        <Button
          type="primary"
          shape="circle"
          icon={<ExportOutlined />}
          onClick={this.onExport}
        />
      </Tooltip>
    </div>
  );

  makeLog = (log: any) => {
    return (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar icon={<UserOutlined />} />}
          title={
            <div>
              {log.user}
              <br />
              <code>{log.path}</code>
            </div>
          }
          description={log.date}
        />
        <Tag color="blue">{log.event}</Tag>
      </List.Item>
    );
  };

  render() {
    const { logs } = this.state;
    return (
      <div className="container">
        <Title level={2}>Room logs</Title>
        <List itemLayout="horizontal">{logs.map(this.makeLog)}</List>
      </div>
    );
  }
}
