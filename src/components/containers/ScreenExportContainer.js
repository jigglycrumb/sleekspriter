import { connect } from "react-redux";
import {
  getExportBackground,
  getExportFormat,
  getExportFrame,
  getExportPart,
  getExportStatus,
  getExportZoom,
  getFileFrames,
  getFileLayers,
  getFilePixels,
  getFileSize,
  getTotalFrames,
} from "../../state/selectors";

import {
  exportBackground,
  exportFormat,
  exportFrame,
  exportPart,
  exportStatus,
  exportZoom,
} from "../../state/actions";

import { ScreenExport } from "../screens";

const mapStateToProps = state => ({
  background: getExportBackground(state),
  format: getExportFormat(state),
  frame: getExportFrame(state),
  frames: getFileFrames(state),
  layers: getFileLayers(state),
  part: getExportPart(state),
  pixels: getFilePixels(state),
  size: getFileSize(state),
  status: getExportStatus(state),
  totalFrames: getTotalFrames(state),
  zoom: getExportZoom(state),
});

const mapDispatchToProps = dispatch => ({
  setBackground: background => dispatch(exportBackground(background)),
  setFormat: format => dispatch(exportFormat(format)),
  setFrame: frame => dispatch(exportFrame(frame)),
  setPart: part => dispatch(exportPart(part)),
  setStatus: status => dispatch(exportStatus(status)),
  setZoom: zoom => dispatch(exportZoom(zoom)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenExport);
