import React, { Component } from "react";
import { Row, Col, Menu } from "antd";
import "./settings-page.scss";
import UserSettings from "src/components/settings-components/user-settings";
import { ClickParam } from "antd/lib/menu";
import InterfaceSettings from "src/components/settings-components/interface-settings";
import SystemSettings from "src/components/settings-components/system-settings";
import { Link } from "react-router-dom";

interface IProps {}
interface IState {
  activeItem: any;
}

export default class SettingsPage extends Component<IProps, IState> {
  state = { activeItem: <UserSettings /> };

  settingsMenuItems = [
    "User",
    "Interface",
    "System",
    "Help",
    "Test",
    "Jesse",
    "Michael",
  ];

  createMenuItems = (item: string) => {
    return <Menu.Item key={item}>{item}</Menu.Item>;
  };

  onItemClick = (param: ClickParam) => {
    switch (param.key) {
      case "Interface":
        return this.setState({
          activeItem: <InterfaceSettings />,
        });
      case "System":
        return this.setState({
          activeItem: <SystemSettings />,
        });
      case "Help":
        return this.setState({
          activeItem: (
            <div>
              <Link to={"/loading"}>Link to loading</Link>
            </div>
          ),
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
      <div>
        <h2>Settings</h2>
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
      </div>
    );
  }
}
