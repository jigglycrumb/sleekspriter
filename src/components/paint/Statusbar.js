import React from "react";
import classnames from "classnames";

import { t } from "../../utils";
import { Hotkeys } from "../../classes";
const gridHotkey = Hotkeys.bindings.paint[8].key;

const Statusbar = (props) => {

  const gridButtonClasses = classnames({
      tiny: true,
      transparent: true,
      active: props.grid,
    }),

    historyButtonClasses = classnames({
      tiny: true,
    });

  return (
    <div className="bar">
      <span id="StatusBarCursorX">X: 0</span>
      <span id="StatusBarCursorY">Y: 0</span>
      <div id="StatusBarColor" style={{background: "transparent"}}></div>
      <span id="StatusBarColorString" className="statusbar-info">{t("transparent")}</span>
      <span className="statusbar-info">{t("Frame")} {props.frame}</span>
      <span className="statusbar-info">{t("Zoom ×")}{props.zoom}</span>
      <div id="StatusBarButtons">

        <button id="historyUndo" className={historyButtonClasses}>
          <i className="flaticon-back-arrow"></i>
        </button>

        <button id="historyRedo" className={historyButtonClasses}>
          <i className="flaticon-arrow"></i>
        </button>

        <button id="toggleGrid" className={gridButtonClasses} onClick={props.gridToggle} title={t("Toggle grid", {key: gridHotkey})}>
          <i className="flaticon-3x3"></i>
        </button>
      </div>
    </div>
  );
};

export default Statusbar;
