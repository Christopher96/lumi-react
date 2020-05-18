import React, { Component } from "react";
import LumiContext from "./lumi-context";
import IPCEvents from "./ipc-events";
import Loading from "src/components/loading/loading";
import { RoomData } from "./interfaces";
import { withRouter } from "react-router";
import IPC from "./ipc";
import Modal from "antd/lib/modal/Modal";
import { Input } from "antd";

const { ipcRenderer } = window.require("electron");

interface IProps {
  history: any;
  location: any;
  match: any;
}
interface IState {
  modal: {
    visible: boolean;
    title: string;
    body: string;
  };
  password: string;
}

class IPCGlobal extends Component<IProps, IState> {
  static contextType = LumiContext;

  state = {
    modal: {
      visible: false,
      title: "",
      body: "",
    },
    password: "",
  };

  componentDidMount() {
    ipcRenderer
      .invoke(IPCEvents.CHECK_CONNECTION)
      .then((room: RoomData | boolean) => {
        if (room !== false) {
          this.context.update({
            room,
            connected: true,
          });
        } else {
          this.context.update({
            connected: false,
          });
        }
      });

    ipcRenderer.on(IPCEvents.NAVIGATE, (_: any, route: string) => {
      this.props.history.push(route);
    });

    ipcRenderer.on(IPCEvents.DISCONNECTED, () => {
      this.context.update({
        connected: false,
      });
    });

    ipcRenderer.on(
      IPCEvents.NOTIFICATION,
      (_: any, title: string, body?: string) => {
        IPC.notify(title, body);
      }
    );

    ipcRenderer.on(
      IPCEvents.PROMPT_OPEN,
      (_: any, title: string, body: string) => {
        console.log(title);
        this.setState({
          modal: {
            visible: true,
            title,
            body,
          },
        });
      }
    );
  }

  onChange = (e: any) => {
    console.log(e);
    this.setState({
      password: e.target.value,
    });
  };

  closeModal = () => {
    const modal = this.state.modal;
    modal.visible = false;
    this.setState({
      modal,
    });
  };

  onOk = () => {
    ipcRenderer.send(IPCEvents.PROMPT_RES, this.state.password);
    this.closeModal();
  };

  onCancel = () => {
    ipcRenderer.send(IPCEvents.PROMPT_RES, false);
    this.closeModal();
  };

  render() {
    const { loading, loadingTitle } = this.context;
    const { modal } = this.state;

    const loader = loading ? <Loading title={loadingTitle}></Loading> : "";
    return (
      <>
        {loader}
        <Modal
          onOk={this.onOk}
          onCancel={this.onCancel}
          visible={modal.visible}
          title={modal.title}
        >
          {modal.body}
          <Input type="password" onChange={this.onChange} />
        </Modal>
      </>
    );
  }
}

const IPCGlobalWithRouter = withRouter(IPCGlobal);
export default IPCGlobalWithRouter;
