import React, { Component } from "react";
import { Route, Redirect, Router } from "react-router-dom";
import { Paths } from "src/pages/paths";
import { history } from "./history";

import MainPage from "./pages/main/main-page";
import LoadingPage from "./pages/loading/loading-page";
import InvitePage from "./pages/invite/invite-page";

export default class App extends Component {
  render() {
    return (
      <>
        <Router history={history}>
          <Route path={Paths.HOME_PATH} component={MainPage} />
          <Route path={Paths.LOADING_PATH} component={LoadingPage} />
          <Route path={Paths.INVITE_PATH} component={InvitePage} />
        </Router>
      </>
    );
  }
}
//<Route path="" component={MainPage} />
//<Redirect to={Paths.HOME_PATH}></Redirect>
