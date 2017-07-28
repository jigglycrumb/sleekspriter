import React from "react";
import classnames from "classnames";
import Menu from "../common/Menu";
import ModalContainer from "../containers/ModalContainer";
import ScreenPaintContainer from "../containers/ScreenPaintContainer";
import ScreenStartContainer from "../containers/ScreenStartContainer";
import ScreenBlocker from "../screens/ScreenBlocker";

import { Hotkeys } from "../../classes";

class App extends React.Component {

  render() {
    Hotkeys.bind(this.props.tab);

    const windowClasses = classnames({
      "window": true,
      [this.props.tab]: true,
    });

    let activeScreen;
    switch(this.props.tab) {
    case "paint":
      activeScreen = <ScreenPaintContainer />;
      break;

    case "animate":
    case "export":
    case "start":
    default:
      activeScreen = <ScreenStartContainer />;
      break;
    }

    const menu = this.props.tab === "start"
               ? null
               : <Menu />;

    return (
      <div className="app">
        {menu}
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
