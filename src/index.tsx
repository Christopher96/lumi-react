// Imports all the default style sheet
import "antd/dist/antd.min.css";

import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import IPC from "./context/ipc";
import * as webpush from "web-push";

ReactDOM.render(<App />, document.getElementById("root"));

const keys = webpush.generateVAPIDKeys();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
