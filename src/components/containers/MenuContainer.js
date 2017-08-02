import { connect } from "react-redux";
import Menu from "../common/Menu";
import {
  layerMerge,
  layerSelectTop,
  modalShow,
  selectionClear,
  selectionEnd,
  selectionStart,
} from "../../state/actions";
import { getFrameLayersZSorted, getPixelsInScope } from "../../state/selectors";

const mapStateToProps = (state) => {
  return {
    frame: state.ui.paint.frame,
    layer: state.ui.paint.layer,
    layers: getFrameLayersZSorted(state),
    size: state.file.size,
    pixels: getPixelsInScope(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    layerMerge: (frame, first, second) => dispatch(layerMerge(frame, first, second)),
    layerSelectTop: (layers) => dispatch(layerSelectTop(layers)),
    modalShow: (modal) => dispatch(modalShow(modal)),
    selectionClear: () => dispatch(selectionClear()),
    selectionEnd: (point) => dispatch(selectionEnd(point)),
    selectionStart: (point) => dispatch(selectionStart(point)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
