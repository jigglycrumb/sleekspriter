import { connect } from "react-redux";
import Stagebox from "../paint/Stagebox";

import {
  brushColor,
  fileDirty,
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

const mapDispatchToProps = {
  brushColor,
  fileDirty,
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Stagebox);
