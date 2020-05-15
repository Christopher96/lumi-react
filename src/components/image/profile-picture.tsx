import React, { Component } from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import './profile-picture.scss'

interface IProps {
  image?: Buffer;
  alt: string;
  size: number
}

interface IState {}

export class ProfilePicture extends Component<IProps, IState> {
  render() {
    let image;

    if (this.props.image) {
      const base64Image = Buffer.from(this.props.image).toString("base64");
      image = (
        <img
          className='profile-picture'
          src={`data:image;base64,${base64Image}`}
          alt={this.props.alt}
          width={this.props.size}
          height={this.props.size}
        />
      );
    } else {
      image = <Avatar size={this.props.size} icon={<UserOutlined />} />;
    }

    return image;
  }
}
