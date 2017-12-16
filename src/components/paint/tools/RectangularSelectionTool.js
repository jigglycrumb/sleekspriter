import React from "react";
import { t } from "../../../utils";

const RectangularSelectionTool = () => {
  return (
    <div id="RectangularSelection-Tool" className="ToolComponent">
      <i className="icon flaticon-selection7" />
      <span className="hint">{t("Select some pixels to work with!")}</span>
    </div>
  );
};

export default RectangularSelectionTool;
