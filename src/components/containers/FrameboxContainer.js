import { connect } from "react-redux";
import Framebox from "../paint/Framebox";
import { getOnionFrameAbsolute, getTotalFrames } from "../../state/selectors";

import {
  frameSelect,
  onionFrame,
  onionMode,
  onionToggle,
} from "../../state/actions";

const mapStateToProps = (state) => ({
  frames: state.file.frames,
  selected: state.ui.paint.frame,
  onion: state.ui.paint.onion,
  onionFrameAbsolute: getOnionFrameAbsolute(state),
  pixels: state.file.pixels,
  size: state.file.size,
  totalFrames: getTotalFrames(state),
});

const mapDispatchToProps = (dispatch) => ({
  frameSelect: (frame) => dispatch(frameSelect(frame)),
  onionFrame: (mode, frame) => dispatch(onionFrame(mode, frame)),
  onionMode: (mode) => dispatch(onionMode(mode)),
  onionToggle: () => dispatch(onionToggle()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Framebox);
