import { connect } from "react-redux";
import Layerbox from "../paint/Layerbox";
import {
  getFilePixels,
  getFileSize,
  getFold,
  getFrameLayersZSorted,
  getNewLayerId,
  getPaintFrame,
  getPaintLayerId,
} from "../../state/selectors";

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

const mapStateToProps = state => ({
  fold: getFold(state),
  frame: getPaintFrame(state),
  selected: getPaintLayerId(state),
  layers: getFrameLayersZSorted(state),
  newLayerId: getNewLayerId(state),
  pixels: getFilePixels(state),
  size: getFileSize(state),
});

const mapDispatchToProps = {
  layerAdd,
  layerMoveDown,
  layerMoveUp,
  layerName,
  layerOpacity,
  layerSelect,
  layerSelectTop,
  layerVisibility,
  modalShow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layerbox);
