import React from "react";
import { connect } from "react-redux";
import Layerbox from "../views/paint/Layerbox";

import {
  foldBox,
  layerAdd,
} from "../state/actions";

const mapStateToProps = (state) => {
  return {
    folded: state.ui.paint.fold.layers,
    layers: state.file.layers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    foldBox: (box) => dispatch(foldBox(box)),
    layerAdd: () => dispatch(layerAdd()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layerbox);
