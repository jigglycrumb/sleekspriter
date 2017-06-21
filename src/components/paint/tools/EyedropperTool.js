import React from "react";
import { t } from "../../../utils";

const EyedropperTool = (props) => {
  return (
    <div id="Eyedropper-Tool" className="ToolComponent">
      <i className="icon flaticon-eyedropper2"></i>
      <div id="EyedropperSwatch" className="colorswatch"></div>
      <ul>
        <li>{t("Hex")}: <span id="EyedropperHex">{t("transparent")}</span></li>
        <li>{t("RGB")}: <span id="EyedropperRGB">-, -, -</span></li>
      </ul>
      <span className="spacer"></span>
      <span className="hint">{t("Click any non-transparent pixel to pick its color.")}</span>
    </div>
  );
};

export default EyedropperTool;
