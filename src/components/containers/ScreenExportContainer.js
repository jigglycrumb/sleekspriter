import { connect } from "react-redux";
import {
  getExportBackground,
  getExportFormat,
  getExportFrame,
  getExportPart,
  getExportStatus,
  getExportZoom,
  getFileFrames,
  getFile,
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
  file: getFile(state),
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

const mapDispatchToProps = {
  exportBackground,
  exportFormat,
  exportFrame,
  exportPart,
  exportStatus,
  exportZoom,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenExport);
