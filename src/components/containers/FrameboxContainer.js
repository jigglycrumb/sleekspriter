import { connect } from "react-redux";
import Framebox from "../paint/Framebox";
import {
  getFileFrames,
  getFileLayers,
  getFilePixels,
  getFileSize,
  getOnion,
  getOnionFrameAbsolute,
  getPaintFrame,
  getTotalFrames,
} from "../../state/selectors";

import {
  frameSelect,
  onionFrame,
  onionMode,
  onionToggle,
} from "../../state/actions";

const mapStateToProps = state => ({
  frames: getFileFrames(state),
  layers: getFileLayers(state),
  selected: getPaintFrame(state),
  onion: getOnion(state),
  onionFrameAbsolute: getOnionFrameAbsolute(state),
  pixels: getFilePixels(state),
  size: getFileSize(state),
  totalFrames: getTotalFrames(state),
});

const mapDispatchToProps = dispatch => ({
  frameSelect: frame => dispatch(frameSelect(frame)),
  onionFrame: (mode, frame) => dispatch(onionFrame(mode, frame)),
  onionMode: mode => dispatch(onionMode(mode)),
  onionToggle: () => dispatch(onionToggle()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Framebox);
