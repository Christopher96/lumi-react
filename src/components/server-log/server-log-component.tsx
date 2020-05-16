import React, { Component } from "react";
import IPC from "src/context/ipc";
import {
  Typography,
  Button,
  List,
  Avatar,
  message,
  Tooltip,
  Tag,
  Row,
} from "antd";
import { ExportOutlined, UserOutlined, SyncOutlined } from "@ant-design/icons";
import { LogsQueryParams, logData } from "src/context/interfaces";

import "./server-log-component.scss";

interface IProps {}
interface IState {
  logs: logData[];
  loading: boolean;
}

const { Title } = Typography;

export default class ServerLogComponent extends Component<IProps, IState> {
  state = {
    logs: [],
    loading: false,
  };

  logIncrement = 5;

  loadLogs = () => {
    this.setState({
      loading: true,
    });
    const offset = this.state.logs.length;
    const config: LogsQueryParams = {
      offset: offset.toString(),
      reverse: "0",
    };
    IPC.fetchLogs(this.logIncrement, config).then((syncedLogs) => {
      this.setState({
        logs: this.state.logs.concat(syncedLogs),
        loading: false,
      });
    });
  };

  componentDidMount = () => {
    this.loadLogs();
  };

  onExport = () => {
    message.loading({ content: "Exporting..." });
    setTimeout(() => {
      message.success({ content: "Exported!", duration: 2 });
    }, 1000);
  };

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

  exportButton = (
    <Tooltip title="Export" className="tooltip">
      <Button
        size="large"
        type="primary"
        shape="circle"
        icon={<ExportOutlined />}
        onClick={this.onExport}
      />
    </Tooltip>
  );

  render() {
    const { logs, loading } = this.state;
    return (
      <div className="container">
        <Title level={2}>Room logs</Title>
        <List
          dataSource={logs}
          renderItem={this.makeLog}
          itemLayout="horizontal"
        ></List>
        <Button className="view-more" onClick={this.loadLogs} loading={loading}>
          View More
        </Button>
      </div>
    );
  }
}
