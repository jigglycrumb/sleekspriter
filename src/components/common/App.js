import React from "react";
import classnames from "classnames";
import MenuContainer from "../containers/MenuContainer";
import ModalContainer from "../containers/ModalContainer";
import ScreenPaintContainer from "../containers/ScreenPaintContainer";
import ScreenStartContainer from "../containers/ScreenStartContainer";
import ScreenExportContainer from "../containers/ScreenExportContainer";
import ScreenBlocker from "../screens/ScreenBlocker";

import { Hotkeys } from "../../classes";

class App extends React.Component {
  componentWillReceiveProps(nextProps) {
    if(this.props.screen !== nextProps.screen) Hotkeys.unbind(this.props.screen);
  }

  render() {
    Hotkeys.bind(this.props.screen);

    const windowClasses = classnames({
      "window": true,
      [this.props.screen]: true,
    });

    let activeScreen;
    switch(this.props.screen) {
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
        <div className={windowClasses}>
          {activeScreen}
        </div>
        <ModalContainer />
        <ScreenBlocker />
      </div>
    );
  }
}

export default App;
