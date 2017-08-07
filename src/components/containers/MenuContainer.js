import { connect } from "react-redux";
import Menu from "../common/Menu";
import {
  layerMerge,
  layerSelectTop,
  modalShow,
  pixelsCut,
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
    pixels: state.file.pixels, //getPixelsInScope(state),
    selection: state.ui.paint.selection,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    layerMerge: (frame, first, second) => dispatch(layerMerge(frame, first, second)),
    layerSelectTop: (layers) => dispatch(layerSelectTop(layers)),
    modalShow: (modal) => dispatch(modalShow(modal)),
    pixelsCut: (frame, layer, pixels, selection) => dispatch(pixelsCut(frame, layer, pixels, selection)),
    selectionClear: () => dispatch(selectionClear()),
    selectionEnd: (point) => dispatch(selectionEnd(point)),
    selectionStart: (point) => dispatch(selectionStart(point)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
