import React from "react";
import { connect } from "react-redux";
import {
  brightnessToolIntensity,
  brightnessToolMode,
  zoomIn,
  zoomOut,
  zoomSelect,
  zoomFit,
} from "../state/actions";

import {
  BrightnessTool,
  BrushTool,
  EraserTool,
  EyedropperTool,
  MoveTool,
  RectangularSelectionTool,
  ZoomTool
} from "../views/paint/tools";

const components = {
  BrightnessTool,
  BrushTool,
  EraserTool,
  EyedropperTool,
  MoveTool,
  RectangularSelectionTool,
  ZoomTool
};

const mapStateToProps = (state) => {
  return {
    tool: state.ui.paint.tool,
    zoom: state.ui.paint.zoom,
    fileSize: state.file.size,
    brightnessTool: state.ui.paint.brightnessTool,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    brightnessToolIntensity: (intensity) => dispatch(brightnessToolIntensity(intensity)),
    brightnessToolMode: (mode) => dispatch(brightnessToolMode(mode)),
    zoomFit: (fileSize) => dispatch(zoomFit(fileSize)),
    zoomIn: () => dispatch(zoomIn()),
    zoomOut: () => dispatch(zoomOut()),
    zoomSelect: (zoom) => dispatch(zoomSelect(zoom)),
  };
};

const ToolContainer = (props) => {
  const ToolComponent = components[props.tool];
  return <ToolComponent {...props} />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolContainer);
