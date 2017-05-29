import React from 'react';
import { connect } from 'react-redux';
import actions from '../state/actions';
import {
  BrightnessTool,
  EraserTool,
  EyedropperTool,
  MoveTool,
  ZoomTool
} from '../views/paint/tools';

const {
  brightnessToolIntensity,
  brightnessToolMode,
  selectZoom,
  zoomIn,
  zoomOut,
  zoomFit,
} = actions;

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
    selectZoom: (zoom) => dispatch(selectZoom(zoom)),
    zoomIn: () => dispatch(zoomIn()),
    zoomOut: () => dispatch(zoomOut()),
    zoomFit: (fileSize) => dispatch(zoomFit(fileSize)),
  };
};

const components = {
    BrightnessTool,
    EraserTool,
    EyedropperTool,
    MoveTool,
    ZoomTool
};

const ToolContainer = (props) => {
  const ToolComponent = components[props.tool];
  return <ToolComponent {...props} />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolContainer);
