/* eslint-disable-next-line */
import iconfont from "./fonts/flaticon";
/* eslint-disable-next-line */
import styles from "./styles";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import whyDidYouRender from "@welldone-software/why-did-you-render";

import AppContainer from "./components/containers/AppContainer";
import store from "./state/store";

whyDidYouRender(React); // TODO: add switch to enable this only in development mode

window.onload = function() {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer />
    </Provider>,
    document.getElementById("app")
  );
};
