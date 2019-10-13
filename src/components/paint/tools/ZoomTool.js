import React from "react";
import PropTypes from "prop-types";
import { t } from "../../../utils";
import config from "../../../config";

const { min, max } = config.zoom;

class ZoomTool extends React.Component {
  constructor(props) {
    super(props);
    this.handleZoomFit = this.handleZoomFit.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
  }

  render() {
    const zoomInDisabled = this.props.zoom >= max;
    const zoomOutDisabled = this.props.zoom <= min;

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
          onChange={this.handleZoom}
        />
        <span>{t("Zoom ×")}</span>
        <input
          type="number"
          min={min}
          max={max}
          value={this.props.zoom}
          onChange={this.handleZoom}
        />
        <button className="small" onClick={this.handleZoomFit}>
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

  handleZoom(e) {
    this.props.zoomSelect(e.target.value);
  }

  handleZoomFit() {
    this.props.zoomFit(this.props.fileSize);
  }
}

ZoomTool.propTypes = {
  fileSize: PropTypes.shape({
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }).isRequired,
  zoom: PropTypes.number.isRequired,
  zoomIn: PropTypes.func.isRequired,
  zoomOut: PropTypes.func.isRequired,
  zoomSelect: PropTypes.func.isRequired,
  zoomFit: PropTypes.func.isRequired,
};

export default ZoomTool;
