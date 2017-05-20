import React from 'react';
import { connect } from 'react-redux';

import EraserTool from '../views/paint/tools/EraserTool';
import EyedropperTool from '../views/paint/tools/EyedropperTool';

// console.log(EraserTool);

const mapStateToProps = (state) => {
  return {
    tool: state.ui.paint.tool
  };
};

const ToolContainer = (props) => {
  return <props.tool />;
  // return React.createElement(props.tool);
};

export default connect(
  mapStateToProps
)(ToolContainer);
