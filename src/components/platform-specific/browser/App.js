import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { throttle } from "lodash";

import MenuContainer from "../../containers/MenuContainer";
import ModalContainer from "../../containers/ModalContainer";
import ScreenPaintContainer from "../../containers/ScreenPaintContainer";
import ScreenExportContainer from "../../containers/ScreenExportContainer";

import { ScreenBlocker } from "../../screens";
import { Hotkeys } from "../../../classes";

import { setWindowTitle } from "../../../utils";

console.log(`Greetings! Running ${APPNAME} ${VERSION} in ${PLATFORM}`);

class App extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.screen !== this.props.screen) {
      Hotkeys.unbind(prevProps.screen);
      Hotkeys.bind(this.props.screen);
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize, false);
    Hotkeys.bind(this.props.screen);
    if (PLATFORM === "electron") {
      setWindowTitle(false, false);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize, false);
  }

  render() {
    const windowClasses = classnames({
      window: true,
      [PLATFORM]: true,
      [this.props.screen]: true,
    });

    let activeScreen;
    switch (this.props.screen) {
      case "paint":
        activeScreen = <ScreenPaintContainer />;
        break;

      case "export":
        activeScreen = <ScreenExportContainer />;
        break;
    }

    return (
      <div className="app">
        <MenuContainer />
        <div className={windowClasses}>{activeScreen}</div>
        <ModalContainer />
        <ScreenBlocker />
      </div>
    );
  }

  resize = throttle(() => {
    this.props.windowResize();
  }, 200);
}

App.propTypes = {
  screen: PropTypes.string.isRequired,
  windowResize: PropTypes.func.isRequired,
};

export default App;
