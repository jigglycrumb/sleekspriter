import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    tool: state.ui.paint.tool
  };
};

const ToolContainer = (props) => {
  return <props.tool />;
};

export default connect(
  mapStateToProps
)(ToolContainer);
