import { connect } from "react-redux";
import Layerbox from "../paint/Layerbox";
import { getFrameLayersZSorted } from "../../state/selectors";

import {
  layerAdd,
  layerMoveDown,
  layerMoveUp,
  layerName,
  layerOpacity,
  layerSelect,
  layerSelectTop,
  layerVisibility,
  modalShow,
} from "../../state/actions";

const mapStateToProps = (state) => ({
  frame: state.ui.paint.frame,
  selected: state.ui.paint.layer,
  layers: getFrameLayersZSorted(state),
  pixels: state.file.pixels,
  size: state.file.size,
});

const mapDispatchToProps = (dispatch) => ({
  layerAdd: (frame, layer, layers) => dispatch(layerAdd(frame, layer, layers)),
  layerMoveDown: (frame, layer, z) => dispatch(layerMoveDown(frame, layer, z)),
  layerMoveUp: (frame, layer, z) => dispatch(layerMoveUp(frame, layer, z)),
  layerName: (layer, name) => dispatch(layerName(layer, name)),
  layerOpacity: (layer, opacity) => dispatch(layerOpacity(layer, opacity)),
  layerSelect: (layer) => dispatch(layerSelect(layer)),
  layerSelectTop: (layers) => dispatch(layerSelectTop(layers)),
  layerVisibility: (layer, visible) => dispatch(layerVisibility(layer, visible)),
  modalShow: (modal) => dispatch(modalShow(modal)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layerbox);
