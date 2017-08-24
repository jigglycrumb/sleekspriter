import { connect } from "react-redux";
import Stagebox from "../paint/Stagebox";

import {
  brushColor,
  modalShow,
  pixelsAdd,
  pixelsDelete,
  pixelsMove,
  selectionClear,
  selectionEnd,
  selectionMove,
  selectionStart,
  toolSelect,
} from "../../state/actions";

import {
  getFilePixels,
  getFileSize,
  getFrameLayersZSorted,
  getOnionFrameAbsolute,
} from "../../state/selectors";

const mapStateToProps = (state) => ({
  brightnessTool: state.ui.paint.brightnessTool,
  color: state.ui.paint.color,
  frame: state.ui.paint.frame,
  grid: state.ui.paint.grid,
  layer: state.ui.paint.layer,
  layers: getFrameLayersZSorted(state),
  onion: state.ui.paint.onion.active,
  onionFrameAbsolute: getOnionFrameAbsolute(state),
  pixels: getFilePixels(state),
  selection: state.ui.paint.selection,
  size: getFileSize(state),
  tool: state.ui.paint.tool,
  zoom: state.ui.paint.zoom,
});

const mapDispatchToProps = (dispatch) => ({
  brushColor: (color) => dispatch(brushColor(color)),
  modalShow: (modal) => dispatch(modalShow(modal)),
  pixelsAdd: (frame, layer, pixels) => dispatch(pixelsAdd(frame, layer, pixels)),
  pixelsDelete: (frame, layer, pixels, allPixels) => dispatch(pixelsDelete(frame, layer, pixels, allPixels)),
  pixelsMove: (frame, layer, pixels, distance, size) => dispatch(pixelsMove(frame, layer, pixels, distance, size)),
  selectionClear: () => dispatch(selectionClear()),
  selectionEnd: (point) => dispatch(selectionEnd(point)),
  selectionMove: (distance) => dispatch(selectionMove(distance)),
  selectionStart: (point) => dispatch(selectionStart(point)),
  toolSelect: (tool) => dispatch(toolSelect(tool)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stagebox);
