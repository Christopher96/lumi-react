import React, { Component } from 'react';
import { Modal } from 'antd';

interface IProps {}
interface IState {
  message: string;
  visible: boolean;
}

export default class Popup extends Component<IProps, IState> {
  state = {
    message: '',
    visible: false
  };

  showModal(message: string) {
    this.setState({
      visible: true,
      message
    });
  }

  handleOk = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <div>
        <Modal title="Hello there!" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <p>{this.state.message}</p>
        </Modal>
      </div>
    );
  }
}
