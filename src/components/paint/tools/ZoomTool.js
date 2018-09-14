import React from "react";
import { t } from "../../../utils";
import config from "../../../config";

const { min, max } = config.zoom;

class ZoomTool extends React.Component {
  constructor(props) {
    super(props);
    this.zoomFit = this.zoomFit.bind(this);
    this.zoomSelect = this.zoomSelect.bind(this);
  }

  render() {
    const zoomInDisabled = this.props.zoom === max,
      zoomOutDisabled = this.props.zoom === min;

    return (
      <div id="Zoom-Tool" className="ToolComponent">
        <i className="icon flaticon-magnifier5" />
        <button
          className="small"
          title={t("Zoom in")}
          onClick={() => this.props.zoomIn()}
          disabled={zoomInDisabled}>
          <i className="flaticon-plus25" />
        </button>
        <button
          className="small"
          title={t("Zoom out")}
          onClick={() => this.props.zoomOut()}
          disabled={zoomOutDisabled}>
          <i className="flaticon-minus18" />
        </button>
        <input
          type="range"
          min={min}
          max={max}
          value={this.props.zoom}
          onChange={this.zoomSelect}
        />
        <span>{t("Zoom ×")}</span>
        <input
          type="number"
          min={min}
          max={max}
          value={this.props.zoom}
          onChange={this.zoomSelect}
        />
        <button className="small" onClick={this.zoomFit}>
          {t("Fit to screen")}
        </button>
        <span className="spacer" />
        <span className="hint">
          {t("A pixel in your sprite is now ${size} pixels on your screen.", {
            size: this.props.zoom,
          })}
        </span>
      </div>
    );
  }

  zoomSelect(e) {
    this.props.zoomSelect(e.target.value);
  }

  zoomFit() {
    this.props.zoomFit(this.props.fileSize);
  }
}

export default ZoomTool;
