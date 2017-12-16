import React from "react";
import { t } from "../../../utils";

const MoveTool = () => {
  return (
    <div id="Move-Tool" className="ToolComponent">
      <i className="icon flaticon-move11" />
      <span className="hint">{t("Move pixels of a layer by dragging.")}</span>
    </div>
  );
};

export default MoveTool;
