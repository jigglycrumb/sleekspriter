import React from "react";
import ScreenPaintContainer from "../containers/ScreenPaintContainer";
import ScreenHelper from "./screens/ScreenHelper";

const App = () => {
  return (
    <div className="app">
      <ScreenHelper />
      <ScreenPaintContainer />
    </div>
  );
};

export default App;
