import React, { Component } from "react";
import { Route, HashRouter, Redirect, Switch } from "react-router-dom";
import Paths from "src/pages/paths";

import MainPage from "./pages/main/main-page";
import InvitePage from "./pages/invite/invite-page";
import SettingsPage from "./pages/settings/settings-page";
import StartPage from "./pages/start/start-page";
import LeavePage from "./pages/leave/leave-page";
import RoomFolderPage from "./pages/room/room-page";
import ServerLogPage from "./pages/server-log/server-log-page";

import { LumiState } from "./context/interfaces";
import { LumiProvider } from "./context/lumi-context";
import IPCGlobalWithRouter from "./context/ipc-global";

import "./base.scss";

export default class App extends Component<{}, LumiState> {
  state = {
    room: null,
    connected: false,
    title: "Lumi",
    loading: false,
    loadingTitle: "",
    update: (obj: any) => {
      this.setState({ ...obj });
    },
  };

  render() {
    return (
      <LumiProvider value={this.state}>
        <HashRouter hashType="slash">
          <Route path="/" component={IPCGlobalWithRouter} />
          <Switch>
            <Route path={Paths.START} component={StartPage} />
            <Route path={Paths.ROOM} component={RoomFolderPage} />
            <Route path={Paths.HOME} component={MainPage} />
            <Route path={Paths.INVITE} component={InvitePage} />
            <Route path={Paths.SETTINGS} component={SettingsPage} />
            <Route path={Paths.LEAVE} component={LeavePage} />
            <Route path={Paths.SERVER_LOG} component={ServerLogPage} />
            <Redirect to={Paths.START} />
          </Switch>
        </HashRouter>
      </LumiProvider>
    );
  }
}
