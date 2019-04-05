import React from "react";
import { connect } from "react-redux";
import * as components from "../paint/tools";

import {
  brightnessToolIntensity,
  brightnessToolMode,
  brushColor,
  zoomIn,
  zoomOut,
  zoomSelect,
  zoomFit,
} from "../../state/actions";

import {
  getBrightnessTool,
  getBrushColor,
  getFileSize,
  getTool,
  getZoom,
} from "../../state/selectors";

const mapStateToProps = state => ({
  tool: getTool(state),
  color: getBrushColor(state),
  zoom: getZoom(state),
  fileSize: getFileSize(state),
  brightnessTool: getBrightnessTool(state),
});

const mapDispatchToProps = dispatch => ({
  brightnessToolIntensity: intensity =>
    dispatch(brightnessToolIntensity(intensity)),
  brightnessToolMode: mode => dispatch(brightnessToolMode(mode)),
  brushColor: color => dispatch(brushColor(color)),
  zoomFit: fileSize => dispatch(zoomFit(fileSize)),
  zoomIn: () => dispatch(zoomIn()),
  zoomOut: () => dispatch(zoomOut()),
  zoomSelect: zoom => dispatch(zoomSelect(zoom)),
});

const ToolContainer = props => {
  const ToolComponent = components[props.tool];
  return <ToolComponent {...props} />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolContainer);
