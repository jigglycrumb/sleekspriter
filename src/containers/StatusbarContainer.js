import React from 'react';
import { connect } from 'react-redux';

import Statusbar from '../views/paint/Statusbar';
import actions from '../state/actions';
const { toggleGrid } = actions;


const mapStateToProps = (state) => {
  return {
    grid: state.ui.paint.grid
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleGrid: () => dispatch(toggleGrid())
  };
};

const StatusBarContainer = (props) => {
  return <Statusbar grid={props.grid} toggleGrid={props.toggleGrid} />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusBarContainer);
