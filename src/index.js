import iconfont from "./fonts/flaticon";
import styles from "./styles/common";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./views/App";
import store from "./state/store";

window.onload = function() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("app")
  );
};
