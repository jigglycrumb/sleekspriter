import { connect } from "react-redux";
import Menu from "platform-specific/Menu";

import {
  fileDirty,
  fileSave,
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
  getClipboard,
  getFile,
  getFileData,
  getFilePixels,
  getFileSize,
  getFrameLayersZSorted,
  getPaintFrame,
  getPaintLayerId,
  getScreen,
  getSelection,
} from "../../state/selectors";

const mapStateToProps = state => {
  return {
    clipboard: getClipboard(state),
    file: getFile(state),
    data: getFileData(state),
    frame: getPaintFrame(state),
    layer: getPaintLayerId(state),
    layers: getFrameLayersZSorted(state),
    size: getFileSize(state),
    pixels: getFilePixels(state),
    screen: getScreen(state),
    selection: getSelection(state),
  };
};

const mapDispatchToProps = {
  fileDirty,
  fileSave,
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
