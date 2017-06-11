import React from "react";
import classnames from "classnames";
import ModalContainer from "../containers/ModalContainer";
import ScreenPaintContainer from "../containers/ScreenPaintContainer";
import ScreenStart from "../screens/ScreenStart";
import ScreenHelper from "../screens/ScreenHelper";
import ScreenBlocker from "../screens/ScreenBlocker";

const App = (props) => {

  const windowClasses = classnames({
    "window": true,
    [props.tab]: true,
  });

  let activeScreen;
  switch(props.tab) {
  case "paint":
    activeScreen = <ScreenPaintContainer />;
    break;

  case "animate":
  case "export":
  case "start":
  default:
    activeScreen = <ScreenStart />;
    break;
  }

  return (
    <div className="app">
      <div className={windowClasses}>
        <ScreenHelper />
        {activeScreen}
      </div>
      <ModalContainer />
      <ScreenBlocker />
    </div>
  );
};

export default App;
