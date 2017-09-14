import { connect } from "react-redux";
import {
  getFileFrames,
  getFileLayers,
  getFilePixels,
  getFileSize,
  getTotalFrames
} from "../../state/selectors";

import {
  exportFormat,
  exportFrame,
  exportPart,
  exportStatus,
  exportZoom
} from "../../state/actions";

import ScreenExport from "../screens/ScreenExport";

const mapStateToProps = (state) => ({
  format: state.ui.export.format,
  frame: state.ui.export.frame,
  frames: getFileFrames(state),
  layers: getFileLayers(state),
  part: state.ui.export.part,
  pixels: getFilePixels(state),
  size: getFileSize(state),
  status: state.ui.export.status,
  totalFrames: getTotalFrames(state),
  zoom: state.ui.export.zoom,
});

const mapDispatchToProps = (dispatch) => ({
  setFormat: (format) => dispatch(exportFormat(format)),
  setFrame: (frame) => dispatch(exportFrame(frame)),
  setPart: (part) => dispatch(exportPart(part)),
  setStatus: (status) => dispatch(exportStatus(status)),
  setZoom: (zoom) => dispatch(exportZoom(zoom)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenExport);
