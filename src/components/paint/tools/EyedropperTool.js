import React from "react";

const EyedropperTool = (props) => {
  return (
    <div id="Eyedropper-Tool" className="ToolComponent">
      <i className="icon flaticon-eyedropper2"></i>
      <div id="EyedropperSwatch" className="colorswatch"></div>
      <ul>
        <li>Hex: <span id="EyedropperHex">transparent</span></li>
        <li>RGB: <span id="EyedropperRGB">-, -, -</span></li>
      </ul>
      <span className="spacer"></span>
      <span className="hint">Click any non-transparent pixel to pick its color.</span>
    </div>
  );
};

export default EyedropperTool;
