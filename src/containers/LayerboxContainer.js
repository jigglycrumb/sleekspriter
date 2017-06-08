import { connect } from "react-redux";
import Layerbox from "../views/paint/Layerbox";

import {
  layerAdd,
  layerName,
  layerOpacity,
  layerSelect,
  layerVisibility,
} from "../state/actions";

const mapStateToProps = (state) => {
  return {
    selected: state.ui.paint.layer,
    layers: state.file.layers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    layerAdd: () => dispatch(layerAdd()),
    layerName: (layer, name) => dispatch(layerName(layer, name)),
    layerOpacity: (layer, opacity) => dispatch(layerOpacity(layer, opacity)),
    layerSelect: (layer) => dispatch(layerSelect(layer)),
    layerVisibility: (layer, visible) => dispatch(layerVisibility(layer, visible)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layerbox);
