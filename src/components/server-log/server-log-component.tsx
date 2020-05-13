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
}

const { Title } = Typography;

export default class ServerLogComponent extends Component<IProps, IState> {
  state = {
    logs: [],
    offsetVal: 0,
    logQuantity: 10,
  };

  syncMore = () => {
    const { logQuantity } = this.state;
    this.setState({
      logQuantity: logQuantity + 5,
    });
    this.componentDidMount();
  };

  componentDidMount = () => {
    const { logQuantity, offsetVal } = this.state;
    const config: LogsQueryParams = {
      offset: offsetVal.toString(),
      reverse: "1",
    };
    IPC.fetchLogs(logQuantity, config).then((logs) => {
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

  bottomMenuButtons = (
    <Row className="bottom-menu">
      <Tooltip title="Sync" className="tooltip">
        <Button
          size="large"
          onClick={this.componentDidMount}
          type="primary"
          shape="circle"
          icon={<SyncOutlined />}
        />
      </Tooltip>
    </Row>
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
        <Button onClick={this.syncMore}>View More</Button>
        <List itemLayout="horizontal">{logs.map(this.makeLog)}</List>
        {this.bottomMenuButtons}
      </div>
    );
  }
}
