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
import RoomFolderPage from "./pages/room-folder/room-folder-page";

const { ipcRenderer } = window.require("electron");

export default class App extends Component {
  render() {
    ipcRenderer.on("navigate", (page: any) => {
      console.log(page);
    });
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
            <Route path={Paths.LEAVE} component={LeavePage} />
            <Route path={Paths.ROOM_FOLDER} component={RoomFolderPage} />
            <Redirect to={Paths.LOADING}></Redirect>
          </Switch>
        </Router>
      </>
    );
  }
}
