import React, { Component } from "react";
import "./loading.scss";
import { Typography } from "antd";

const { Title } = Typography;

interface IProps {
  title: string;
}
interface IState {
  dots: string;
}

const logo = require("src/assets/logo.png");

export default class Loading extends Component<IProps, IState> {
  state = {
    dots: "",
  };

  componentDidMount() {
    setInterval(() => {
      let dots = this.state.dots;
      if (dots === "...") {
        dots = "";
      } else {
        dots += ".";
      }
      this.setState({
        dots,
      });
    }, 300);
  }

  render() {
    return (
      <div className="loadingZone">
        <div className="center">
          <Title level={2} className="loadingTitle">
            {this.props.title}
            {this.state.dots}
          </Title>
          <img src={logo} alt="logo" className="lumiFish" />
        </div>
      </div>
    );
  }
}
