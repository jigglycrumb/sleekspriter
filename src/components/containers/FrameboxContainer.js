import { connect } from "react-redux";
import Framebox from "../paint/Framebox";
import { getOnionFrameAbsolute, getTotalFrames } from "../../state/selectors";

import {
  frameSelect,
  onionFrame,
  onionMode,
  onionToggle,
} from "../../state/actions";

const mapStateToProps = (state) => {
  return {
    frames: state.file.frames,
    selected: state.ui.paint.frame,
    onion: state.ui.paint.onion,
    totalFrames: getTotalFrames(state),
    onionFrameAbsolute: getOnionFrameAbsolute(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    frameSelect: (frame) => dispatch(frameSelect(frame)),
    onionFrame: (mode, frame) => dispatch(onionFrame(mode, frame)),
    onionMode: (mode) => dispatch(onionMode(mode)),
    onionToggle: () => dispatch(onionToggle()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Framebox);
