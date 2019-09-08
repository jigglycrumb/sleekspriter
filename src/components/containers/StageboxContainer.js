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
  zoomIn,
} from "../../state/actions";

import {
  getBrightnessTool,
  getBrushColor,
  getFilePixels,
  getFileSize,
  getFrameLayersZSorted,
  getGrid,
  getOnion,
  getOnionFrameAbsolute,
  getOnionFrameLayersZSorted,
  getPaintFrame,
  getPaintLayerId,
  getSelection,
  getTool,
  getZoom,
} from "../../state/selectors";

const mapStateToProps = state => ({
  brightnessTool: getBrightnessTool(state),
  color: getBrushColor(state),
  frame: getPaintFrame(state),
  grid: getGrid(state),
  layer: getPaintLayerId(state),
  layers: getFrameLayersZSorted(state),
  onion: getOnion(state).active,
  onionFrameAbsolute: getOnionFrameAbsolute(state),
  onionFrameLayers: getOnionFrameLayersZSorted(state),
  pixels: getFilePixels(state),
  selection: getSelection(state),
  size: getFileSize(state),
  tool: getTool(state),
  zoom: getZoom(state),
});

const mapDispatchToProps = dispatch => ({
  brushColor: color => dispatch(brushColor(color)),
  modalShow: modal => dispatch(modalShow(modal)),
  pixelsAdd: (frame, layer, pixels) =>
    dispatch(pixelsAdd(frame, layer, pixels)),
  pixelsDelete: (frame, layer, pixels, allPixels) =>
    dispatch(pixelsDelete(frame, layer, pixels, allPixels)),
  pixelsMove: (frame, layer, pixels, distance, size) =>
    dispatch(pixelsMove(frame, layer, pixels, distance, size)),
  selectionClear: () => dispatch(selectionClear()),
  selectionEnd: point => dispatch(selectionEnd(point)),
  selectionMove: distance => dispatch(selectionMove(distance)),
  selectionStart: point => dispatch(selectionStart(point)),
  toolSelect: tool => dispatch(toolSelect(tool)),
  zoomIn: () => dispatch(zoomIn()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stagebox);
