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

interface IProps {}
interface IState {
  logs: logData[];
  offsetVal: number;
  logQuantity: number;
  loading: boolean;
}

const { Title } = Typography;

export default class ServerLogComponent extends Component<IProps, IState> {
  state = {
    logs: [],
    offsetVal: 0,
    logQuantity: 10,
    loading: false,
  };

  syncMore = () => {
    this.setState({
      logQuantity: this.state.logQuantity + 5,
      loading: true,
    });
    setTimeout(() => {
      this.setState({ loading: false });
      this.componentDidMount();
    }, 2000);
  };

  componentDidMount = () => {
    const { logQuantity, offsetVal } = this.state;
    const config: LogsQueryParams = {
      offset: offsetVal.toString(),
      reverse: "1",
    };
    IPC.fetchLogs(logQuantity, config).then((syncedLogs) => {
      console.log(syncedLogs);
      this.setState({
        logs: syncedLogs.reverse(),
      });
    });
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

  syncButton = (
    <Tooltip title="Sync" className="tooltip">
      <Button
        size="large"
        onClick={this.componentDidMount}
        type="primary"
        shape="circle"
        icon={<SyncOutlined />}
      />
    </Tooltip>
  );

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
        <Button onClick={this.syncMore} loading={loading}>
          View More
        </Button>
        <List itemLayout="horizontal">{logs.map(this.makeLog)}</List>
        <Row className="bottom-menu">{this.syncButton}</Row>
      </div>
    );
  }
}
