import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { throttle } from "lodash";

import {
  MenuContainer,
  ModalContainer,
  ScreenPaintContainer,
  ScreenStartContainer,
  ScreenExportContainer,
} from "../containers";

import { ScreenBlocker } from "../screens";
import { Hotkeys } from "../../classes";

class App extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.screen !== nextProps.screen)
      Hotkeys.unbind(this.props.screen);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize, false);
  }

  render() {
    Hotkeys.bind(this.props.screen);

    const windowClasses = classnames({
      window: true,
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

      case "animate":
      case "start":
      default:
        activeScreen = <ScreenStartContainer />;
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
  windowResize: PropTypes.func.isRequired,
};

export default App;
