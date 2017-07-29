import React from "react";
import classnames from "classnames";
import MenuContainer from "../containers/MenuContainer";
import ModalContainer from "../containers/ModalContainer";
import ScreenPaintContainer from "../containers/ScreenPaintContainer";
import ScreenStartContainer from "../containers/ScreenStartContainer";
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

    case "animate":
    case "export":
    case "start":
    default:
      activeScreen = <ScreenStartContainer />;
      break;
    }

    const menu = this.props.screen === "start"
               ? null
               : <MenuContainer />;

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
