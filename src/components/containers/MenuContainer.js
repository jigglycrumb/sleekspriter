import { connect } from "react-redux";
import Menu from "../common/Menu";
import {
  layerMerge,
  layerSelectTop,
  modalShow,
  pixelsCopy,
  pixelsCut,
  pixelsDelete,
  selectionClear,
  selectionEnd,
  selectionStart,
} from "../../state/actions";
import { getFrameLayersZSorted } from "../../state/selectors";

const mapStateToProps = (state) => {
  return {
    frame: state.ui.paint.frame,
    layer: state.ui.paint.layer,
    layers: getFrameLayersZSorted(state),
    size: state.file.size,
    pixels: state.file.pixels,
    selection: state.ui.paint.selection,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    layerMerge: (frame, first, second) => dispatch(layerMerge(frame, first, second)),
    layerSelectTop: (layers) => dispatch(layerSelectTop(layers)),
    modalShow: (modal) => dispatch(modalShow(modal)),
    pixelsCopy: (frame, layer, pixels) => dispatch(pixelsCopy(frame, layer, pixels)),
    pixelsCut: (frame, layer, pixels) => dispatch(pixelsCut(frame, layer, pixels)),
    pixelsDelete: (frame, layer, pixels) => dispatch(pixelsDelete(frame, layer, pixels)),
    selectionClear: () => dispatch(selectionClear()),
    selectionEnd: (point) => dispatch(selectionEnd(point)),
    selectionStart: (point) => dispatch(selectionStart(point)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
