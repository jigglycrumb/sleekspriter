import { connect } from "react-redux";
import Menu from "../common/Menu";
import {
  frameFlipHorizontal,
  frameFlipVertical,
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
  screenSelect,
  selectionClear,
  selectionEnd,
  selectionStart,
} from "../../state/actions";
import {
  getFilePixels,
  getFileSize,
  getFrameLayersZSorted
} from "../../state/selectors";

const mapStateToProps = (state) => {
  return {
    clipboard: state.ui.paint.clipboard,
    frame: state.ui.paint.frame,
    layer: state.ui.paint.layer,
    layers: getFrameLayersZSorted(state),
    size: getFileSize(state),
    pixels: getFilePixels(state),
    screen: state.ui.app.screen,
    selection: state.ui.paint.selection,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    frameFlipHorizontal: (frame, pixels, pivot, size) => dispatch(frameFlipHorizontal(frame, pixels, pivot, size)),
    frameFlipVertical: (frame, pixels, pivot, size) => dispatch(frameFlipVertical(frame, pixels, pivot, size)),
    frameRotate: (frame, pixels, angle, pivot, size) => dispatch(frameRotate(frame, pixels, angle, pivot, size)),
    layerMerge: (frame, first, second, allPixels) => dispatch(layerMerge(frame, first, second, allPixels)),
    layerSelectTop: (layers) => dispatch(layerSelectTop(layers)),
    modalShow: (modal) => dispatch(modalShow(modal)),
    pixelsCopy: (frame, layer, pixels) => dispatch(pixelsCopy(frame, layer, pixels)),
    pixelsCut: (frame, layer, pixels, allPixels) => dispatch(pixelsCut(frame, layer, pixels, allPixels)),
    pixelsDelete: (frame, layer, pixels, allPixels) => dispatch(pixelsDelete(frame, layer, pixels, allPixels)),
    pixelsFlipHorizontal: (frame, layer, pixels, pivot, size) => dispatch(pixelsFlipHorizontal(frame, layer, pixels, pivot, size)),
    pixelsFlipVertical: (frame, layer, pixels, pivot, size) => dispatch(pixelsFlipVertical(frame, layer, pixels, pivot, size)),
    pixelsPaste: (frame, layer, pixels) => dispatch(pixelsPaste(frame, layer, pixels)),
    pixelsRotate: (frame, layer, pixels, angle, pivot, size) => dispatch(pixelsRotate(frame, layer, pixels, angle, pivot, size)),
    screenSelect: (screen) => dispatch(screenSelect(screen)),
    selectionClear: () => dispatch(selectionClear()),
    selectionEnd: (point) => dispatch(selectionEnd(point)),
    selectionStart: (point) => dispatch(selectionStart(point)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
