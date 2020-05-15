import React, { Component } from "react";
import { Row, Col, Menu, Tooltip, Button } from "antd";
import "./settings-page.scss";
import UserSettings from "src/components/settings-components/user-settings";
import { ClickParam } from "antd/lib/menu";
import InterfaceSettings from "src/components/settings-components/interface-settings";
import RoomSettings from "src/components/settings-components/room-settings";
import Paths from "../paths";
import { HomeOutlined } from "@ant-design/icons";

interface IProps {}
interface IState {
  activeItem: any;
}

export default class SettingsPage extends Component<IProps, IState> {
  state = { activeItem: <UserSettings /> };

  settingsMenuItems = ["User", "Room", "Interface"];

  createMenuItems = (item: string) => {
    return <Menu.Item key={item}>{item}</Menu.Item>;
  };

  onItemClick = (param: ClickParam) => {
    switch (param.key) {
      case "Room":
        return this.setState({
          activeItem: <RoomSettings />,
        });
      case "Interface":
        return this.setState({
          activeItem: <InterfaceSettings />,
        });
      default:
        return this.setState({
          activeItem: <UserSettings />,
        });
    }
  };

  render() {
    const { activeItem } = this.state;
    return (
      <div className="settings-page">
        <Row>
          <Col span={4} className="settingsMenu">
            <Menu mode="inline" onClick={this.onItemClick}>
              {this.settingsMenuItems.map((element) => {
                return this.createMenuItems(element);
              })}
            </Menu>
          </Col>
          <Col span={16} push={2}>
            <div className="option-box">{activeItem}</div>
          </Col>
        </Row>
        <Row className="bottom-menu">
          <Tooltip title="Home" className="tooltip">
            <a href={`#${Paths.START}`}>
            <Button
              size="large"
              type="primary"
              shape="circle"
              icon={<HomeOutlined/>}
            />
            </a>
          </Tooltip>
        </Row>
      </div>
    );
  }
}
