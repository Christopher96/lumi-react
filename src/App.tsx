import React, { Component } from "react";
import { Route, Router, Redirect, Switch } from "react-router-dom";
import { Paths } from "src/pages/paths";
import { history } from "./history";

import TopBar from "./components/topbar/top-bar";
import MainPage from "./pages/main/main-page";
import LoadingPage from "./pages/loading/loading-page";
import InvitePage from "./pages/invite/invite-page";
import SettingsPage from "./pages/settings/settings-page";
import StartPage from "./pages/start/start-page";

import "./colors.scss";

export default class App extends Component {
  render() {
    return (
      <>
        <Router history={history}>
          <Route path={Paths.TOP_BAR} component={TopBar} />
          <Switch>
            <Route path={Paths.HOME} component={MainPage} />
            <Route path={Paths.START} component={StartPage} />
            <Route path={Paths.LOADING} component={LoadingPage} />
            <Route path={Paths.INVITE} component={InvitePage} />
            <Route path={Paths.SETTINGS} component={SettingsPage} />
            <Redirect to={Paths.SETTINGS}></Redirect>
          </Switch>
        </Router>
      </>
    );
  }
}
