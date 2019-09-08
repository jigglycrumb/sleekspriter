/* eslint-disable-next-line */
import iconfont from "./fonts/flaticon";
/* eslint-disable-next-line */
import styles from "./styles";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import AppContainer from "./components/containers/AppContainer";
import store from "./state/store";

window.onload = function() {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer />
    </Provider>,
    document.getElementById("app")
  );
};
