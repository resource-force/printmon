import "react-app-polyfill/ie9"; // For IE 9-11 support (https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill)
import React from "react";
import { render } from "react-snapshot";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
