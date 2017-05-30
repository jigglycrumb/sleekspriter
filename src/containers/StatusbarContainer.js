import React from "react";
import { connect } from "react-redux";

import Statusbar from "../views/paint/Statusbar";
import { toggleGrid } from "../state/actions";

const mapStateToProps = (state) => {
  return {
    grid: state.ui.paint.grid,
    zoom: state.ui.paint.zoom
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleGrid: () => dispatch(toggleGrid())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Statusbar);
