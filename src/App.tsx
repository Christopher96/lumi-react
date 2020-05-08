import React, { Component } from "react";
import { Route, Router, Redirect, Switch } from "react-router-dom";
import Paths from "src/pages/paths";
import { history } from "./history";

import TopBar from "./components/topbar/top-bar";
import MainPage from "./pages/main/main-page";
import LoadingPage from "./pages/loading/loading-page";
import InvitePage from "./pages/invite/invite-page";
import SettingsPage from "./pages/settings/settings-page";
import StartPage from "./pages/start/start-page";
import LeavePage from "./pages/leave/leave-page";

import "./colors.scss";
import { LumiState, LumiProvider } from "./context/lumi-context";
import IPC from "./context/ipc";

export default class App extends Component<{}, LumiState> {
  state = {
    title: "",
    connected: false,
    loading: false,
    update: (obj: any) => {
      this.setState({ ...obj });
    },
  };

  componentDidMount() {
    new IPC(this.context, history);
  }

  render() {
    return (
      <LumiProvider value={this.state}>
        <Router history={history}>
          <Route path={Paths.TOP_BAR} component={TopBar} />
          <Switch>
            <Route path={Paths.HOME} component={MainPage} />
            <Route path={Paths.START} component={StartPage} />
            <Route path={Paths.LOADING} component={LoadingPage} />
            <Route path={Paths.INVITE} component={InvitePage} />
            <Route path={Paths.SETTINGS} component={SettingsPage} />
            <Route path={Paths.LEAVE} component={LeavePage} />
            <Redirect to={Paths.START}></Redirect>
          </Switch>
        </Router>
      </LumiProvider>
    );
  }
}
