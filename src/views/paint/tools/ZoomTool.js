import React from "react";
import config from "../../../config";

const { min, max } = config.zoom;

class ZoomTool extends React.Component {
  render() {
    const zoomInDisabled = this.props.zoom === max,
          zoomOutDisabled = this.props.zoom === min;

    return (
      <div id="Zoom-Tool" className="ToolComponent">
        <i className="icon flaticon-magnifier5"></i>
        <button className="small" title="Zoom in" onClick={::this.props.zoomIn} disabled={zoomInDisabled}>
          <i className="flaticon-plus25"></i>
        </button>
        <button className="small" title="Zoom out" onClick={::this.props.zoomOut} disabled={zoomOutDisabled}>
          <i className="flaticon-minus18"></i>
        </button>
        <input type="range" min={min} max={max} value={this.props.zoom} onChange={::this.selectZoom} />
        <span>Zoom &times;</span>
        <input type="number" min={min} max={max} value={this.props.zoom} onChange={::this.selectZoom} />
        <button className="small" onClick={::this.zoomFit}>Fit to screen</button>
        <span className="spacer"></span>
        <span className="hint">A pixel in your sprite is now {this.props.zoom} pixels on your screen.</span>
      </div>
    );
  }

  selectZoom(e) {
    this.props.selectZoom(e.target.value);
  }

  zoomFit() {
    this.props.zoomFit(this.props.fileSize);
  }
}

export default ZoomTool;
