import React, { Component } from "react";
import { Modal } from "antd";
import { ModalProps } from "antd/lib/modal";

interface IProps extends ModalProps {
  message: string;
}
interface IState {}

export default class Popup extends Component<IProps, IState> {
  render() {
    return (
      <div>
        <Modal {...this.props}>
          <p>{this.props.message}</p>
        </Modal>
      </div>
    );
  }
}
