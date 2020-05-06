import React, { Component } from "react";
import { Route, Redirect, Router } from "react-router-dom";
import { Paths } from "src/pages/paths";
import { history } from "./history";

import MainPage from "./pages/main/main-page";
import LoadingPage from "./pages/loading/loading-page";
import InvitePage from "./pages/invite/invite-page";
import SettingsPage from "./pages/settings/settings-page";

export default class App extends Component {
  render() {
    return (
      <>
        <Router history={history}>
          <Route path={Paths.HOME_PATH} component={MainPage} />
          <Route path={Paths.LOADING_PATH} component={LoadingPage} />
          <Route path={Paths.INVITE_PATH} component={InvitePage} />
          <Route path={Paths.SETTINGS_PATH} component={SettingsPage} />
        </Router>
      </>
    );
  }
}
//<Route path={Paths.TOP_BAR} component={MainPage} />
//<Route path="" component={MainPage} />
//<Redirect to={Paths.HOME_PATH}></Redirect>
