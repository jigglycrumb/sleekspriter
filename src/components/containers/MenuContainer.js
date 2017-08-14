import { connect } from "react-redux";
import Menu from "../common/Menu";
import {
  frameRotate,
  layerMerge,
  layerSelectTop,
  modalShow,
  pixelsCopy,
  pixelsCut,
  pixelsDelete,
  pixelsFlipHorizontal,
  pixelsFlipVertical,
  pixelsPaste,
  pixelsRotate,
  selectionClear,
  selectionEnd,
  selectionStart,
} from "../../state/actions";
import { getFrameLayersZSorted } from "../../state/selectors";

const mapStateToProps = (state) => {
  return {
    clipboard: state.ui.paint.clipboard,
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
    frameRotate: (frame, pixels, angle, pivot, size) => dispatch(frameRotate(frame, pixels, angle, pivot, size)),
    layerMerge: (frame, first, second) => dispatch(layerMerge(frame, first, second)),
    layerSelectTop: (layers) => dispatch(layerSelectTop(layers)),
    modalShow: (modal) => dispatch(modalShow(modal)),
    pixelsCopy: (frame, layer, pixels) => dispatch(pixelsCopy(frame, layer, pixels)),
    pixelsCut: (frame, layer, pixels) => dispatch(pixelsCut(frame, layer, pixels)),
    pixelsDelete: (frame, layer, pixels) => dispatch(pixelsDelete(frame, layer, pixels)),
    pixelsFlipHorizontal: (frame, layer, pixels, pivot, size) => dispatch(pixelsFlipHorizontal(frame, layer, pixels, pivot, size)),
    pixelsFlipVertical: (frame, layer, pixels, pivot, size) => dispatch(pixelsFlipVertical(frame, layer, pixels, pivot, size)),
    pixelsPaste: (frame, layer, pixels) => dispatch(pixelsPaste(frame, layer, pixels)),
    pixelsRotate: (frame, layer, pixels, angle, pivot, size) => dispatch(pixelsRotate(frame, layer, pixels, angle, pivot, size)),
    selectionClear: () => dispatch(selectionClear()),
    selectionEnd: (point) => dispatch(selectionEnd(point)),
    selectionStart: (point) => dispatch(selectionStart(point)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
