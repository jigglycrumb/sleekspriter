import React from 'react';
import { connect } from 'react-redux';

import actions from '../state/actions';
const {
  selectZoom,
  zoomIn,
  zoomOut,
  zoomFit,
} = actions;

import {
  EraserTool,
  EyedropperTool,
  MoveTool,
  ZoomTool
} from '../views/paint/tools';

const mapStateToProps = (state) => {

  console.info(state);

  return {
    tool: state.ui.paint.tool,
    zoom: state.ui.paint.zoom,
    fileSize: state.file.size,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectZoom: (zoom) => dispatch(selectZoom(zoom)),
    zoomIn: () => dispatch(zoomIn()),
    zoomOut: () => dispatch(zoomOut()),
    zoomFit: (fileSize) => dispatch(zoomFit(fileSize)),
  };
};

const components = {
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
