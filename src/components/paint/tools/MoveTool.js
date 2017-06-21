import React from "react";
import { t } from "../../../utils";

const MoveTool = (props) => {
  return (
    <div id="Move-Tool" className="ToolComponent">
      <i className="icon flaticon-move11"></i>
      <span className="hint">{t("Move pixels of a layer by dragging.")}</span>
    </div>
  );
};

export default MoveTool;
