import { connect } from "react-redux";
import Framebox from "../views/paint/Framebox";

import {
  frameSelect,
  onionFrame,
  onionMode,
  toggleOnion,
} from "../state/actions";

const mapStateToProps = (state) => {
  return {
    frames: state.file.frames,
    selected: state.ui.paint.frame,
    onion: state.ui.paint.onion,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    frameSelect: (frame) => dispatch(frameSelect(frame)),
    onionFrame: (mode, frame) => dispatch(onionFrame(mode, frame)),
    onionMode: (mode) => dispatch(onionMode(mode)),
    toggleOnion: () => dispatch(toggleOnion()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Framebox);
