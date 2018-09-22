import React from "react";
import classnames from "classnames";

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
}

export default App;
