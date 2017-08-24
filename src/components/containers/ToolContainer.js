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

import { getFileSize } from "../../state/selectors";

const mapStateToProps = (state) => ({
  tool: state.ui.paint.tool,
  color: state.ui.paint.color,
  zoom: state.ui.paint.zoom,
  fileSize: getFileSize(state),
  brightnessTool: state.ui.paint.brightnessTool,
});

const mapDispatchToProps = (dispatch) => ({
  brightnessToolIntensity: (intensity) => dispatch(brightnessToolIntensity(intensity)),
  brightnessToolMode: (mode) => dispatch(brightnessToolMode(mode)),
  brushColor: (color) => dispatch(brushColor(color)),
  zoomFit: (fileSize) => dispatch(zoomFit(fileSize)),
  zoomIn: () => dispatch(zoomIn()),
  zoomOut: () => dispatch(zoomOut()),
  zoomSelect: (zoom) => dispatch(zoomSelect(zoom)),
});

const ToolContainer = (props) => {
  const ToolComponent = components[props.tool];
  return <ToolComponent {...props} />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolContainer);
