import React, { Component } from 'react';
import { Input } from 'antd';
import './main-page.scss';
import Popup from 'src/components/popup/popup';

interface IProps {}
interface IState {
  btnTxt: string;
}

const { Search } = Input;

export default class MainPage extends Component<IProps, IState> {
  popup: React.RefObject<Popup> = React.createRef();
  state = {
    btnTxt: 'Hello'
  };

  handleClick = (message: string) => {
    this.popup.current?.showModal(message);
  };

  render() {
    const { btnTxt } = this.state;
    return (
      <div className="center">
        <Popup ref={this.popup} />
        <Search placeholder="Enter a message..." enterButton={btnTxt} size="large" onSearch={this.handleClick} />
      </div>
    );
  }
}
