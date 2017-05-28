import React from 'react';
import { connect } from 'react-redux';

import {
  EraserTool,
  EyedropperTool,
  MoveTool,
  ZoomTool
} from '../views/paint/tools';

const mapStateToProps = (state) => {
  return {
    tool: state.ui.paint.tool
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
  return <ToolComponent />;
};

export default connect(
  mapStateToProps
)(ToolContainer);
