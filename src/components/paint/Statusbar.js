import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { t } from "../../utils";
import { Hotkeys } from "../../classes";

const gridHotkey = Hotkeys.bindings.paint[8].key;
const undoHotkey = Hotkeys.bindings.paint[10].key;
const redoHotkey = Hotkeys.bindings.paint[11].key;

const Statusbar = props => {
  const gridButtonClasses = classnames({
    tiny: true,
    transparent: true,
    active: props.grid,
  });
  const historyButtonClasses = classnames({
    tiny: true,
  });

  return (
    <div className="bar">
      <span id="StatusBarCursorX">X: 0</span>
      <span id="StatusBarCursorY">Y: 0</span>
      <div id="StatusBarColor" style={{ background: "transparent" }} />
      <span id="StatusBarColorString" className="statusbar-info">
        {t("transparent")}
      </span>
      <span className="statusbar-info">
        {t("Frame")} {props.frame}, {props.pixelCount} {t("pixels")}
      </span>
      <span className="statusbar-info">
        {t("Zoom ×")}
        {props.zoom}
      </span>
      <div id="StatusBarButtons">
        <button
          id="historyUndo"
          className={historyButtonClasses}
          onClick={props.undo}
          disabled={!props.canUndo}
          title={t("Undo", { key: undoHotkey })}>
          <i className="flaticon-back-arrow" />
        </button>

        <button
          id="historyRedo"
          className={historyButtonClasses}
          onClick={props.redo}
          disabled={!props.canRedo}
          title={t("Redo", { key: redoHotkey })}>
          <i className="flaticon-arrow" />
        </button>

        <button
          id="toggleGrid"
          className={gridButtonClasses}
          onClick={props.gridToggle}
          title={t("Toggle grid", { key: gridHotkey })}>
          <i className="flaticon-3x3" />
        </button>
      </div>
    </div>
  );
};

Statusbar.propTypes = {
  grid: PropTypes.bool.isRequired,
  gridToggle: PropTypes.func.isRequired,
  frame: PropTypes.number.isRequired,
  pixelCount: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  undo: PropTypes.func.isRequired,
  canUndo: PropTypes.bool.isRequired,
  redo: PropTypes.func.isRequired,
  canRedo: PropTypes.bool.isRequired,
};

export default Statusbar;
