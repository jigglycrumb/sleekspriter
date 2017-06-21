import React from "react";
import { t } from "../../../utils";

const RectangularSelectionTool = (props) => {
  return (
    <div id="RectangularSelection-Tool" className="ToolComponent">
      <i className="icon flaticon-selection7"></i>
      <span className="hint">{t("Select some pixels to work with!")}</span>
    </div>
  );
};

export default RectangularSelectionTool;
