import React, { Component } from 'react';
import { Route, Redirect, Router } from 'react-router-dom';
import { Paths } from 'src/pages/paths';
import { history } from './history';

import MainPage from './pages/main/main-page';

export default class App extends Component {
  render() {
    return (
      <>
        <Router history={history}>
          <Route path={Paths.HOME_PATH} component={MainPage} />
          <Redirect to={Paths.HOME_PATH}></Redirect>
        </Router>
      </>
    );
  }
}
