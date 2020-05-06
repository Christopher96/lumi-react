import React, { Component } from "react";
import { Modal } from "antd";
import { ModalProps } from "antd/lib/modal";

interface IProps extends ModalProps {
  message: string;
}
interface IState {}

export default class InviteComponent extends Component<IProps, IState> {
  render() {
    return (
      <div>
        <Modal {...this.props}>
          <p>{this.props.message}</p>
          <p>hej12345</p>
        </Modal>
      </div>
    );
  }
}
