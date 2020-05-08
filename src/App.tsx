import React, { Component } from "react";
import { Route, Router, Redirect, Switch } from "react-router-dom";
import Paths from "src/pages/paths";
import { history } from "./history";

import MainPage from "./pages/main/main-page";
import LoadingPage from "./pages/loading/loading-page";
import InvitePage from "./pages/invite/invite-page";
import SettingsPage from "./pages/settings/settings-page";
import StartPage from "./pages/start/start-page";
import LeavePage from "./pages/leave/leave-page";
import RoomFolderPage from "./pages/room-folder/room-folder-page";
import ServerLogPage from "./pages/server-log/server-log-page";

import { LumiState, LumiProvider } from "./context/lumi-context";
import IPCGlobal from "./context/ipc-global";

import "./colors.scss";

export default class App extends Component<{}, LumiState> {
  state = {
    title: "",
    connected: false,
    loading: false,
    update: (obj: any) => {
      this.setState({ ...obj });
    },
  };

  render() {
    return (
      <LumiProvider value={this.state}>
        <Router history={history}>
          <Route path="/" history={history} component={IPCGlobal} />
          <Switch>
            <Route path={Paths.START} component={StartPage} />
            <Route path={Paths.ROOM} component={RoomFolderPage} />
            <Route path={Paths.HOME} component={MainPage} />
            <Route path={Paths.LOADING} component={LoadingPage} />
            <Route path={Paths.INVITE} component={InvitePage} />
            <Route path={Paths.SETTINGS} component={SettingsPage} />
            <Route path={Paths.LEAVE} component={LeavePage} />
            <Route path={Paths.SERVER_LOG} component={ServerLogPage} />
            <Redirect to={Paths.START}></Redirect>
          </Switch>
        </Router>
      </LumiProvider>
    );
  }
}
