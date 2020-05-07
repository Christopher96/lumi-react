import React, { Component } from "react";
import { Row, Col, Menu, Button, message } from "antd";
import "./settings-page.scss";
import UserSettings from "src/components/settings-components/user-settings";
import { ClickParam } from "antd/lib/menu";
import InterfaceSettings from "src/components/settings-components/interface-settings";
import SystemSettings from "src/components/settings-components/system-settings";
import HelpSettings from "src/components/settings-components/help-settings";

interface IProps {}
interface IState {
  activeItem: any;
}

export default class SettingsPage extends Component<IProps, IState> {
  state = { activeItem: <UserSettings /> };

  settingsMenuItems = ["User", "Interface", "System", "Help"];

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
              <HelpSettings />
            </div>
          ),
        });
      default:
        return this.setState({
          activeItem: <UserSettings />,
        });
    }
  };

  onApply = () => {
    message.success("Saved changes", 1);
  };

  render() {
    const { activeItem } = this.state;
    return (
      <div>
        <h2 className="settings-header">Settings</h2>
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
        <br />
        <Row>
          <Col span={4} push={16}>
            <Button>Cancel</Button>
          </Col>
          <Col span={4} push={16}>
            <Button type="primary" onClick={this.onApply}>
              Apply
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
