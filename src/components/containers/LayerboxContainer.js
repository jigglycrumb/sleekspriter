import { connect } from "react-redux";
import Layerbox from "../paint/Layerbox";
import { getFrameLayers } from "../../state/selectors";

import {
  layerAdd,
  layerName,
  layerOpacity,
  layerSelect,
  layerVisibility,
  modalShow,
} from "../../state/actions";

const mapStateToProps = (state) => {
  return {
    selected: state.ui.paint.layer,
    layers: getFrameLayers(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    layerAdd: () => dispatch(layerAdd()),
    layerName: (layer, name) => dispatch(layerName(layer, name)),
    layerOpacity: (layer, opacity) => dispatch(layerOpacity(layer, opacity)),
    layerSelect: (layer) => dispatch(layerSelect(layer)),
    layerVisibility: (layer, visible) => dispatch(layerVisibility(layer, visible)),
    modalShow: (modal) => dispatch(modalShow(modal)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layerbox);
