import { connect } from "react-redux";
import Stagebox from "../paint/Stagebox";
import {
  pixelsAdd
} from "../../state/actions";
import {
  getFrameLayersZSorted,
  getOnionFrameAbsolute
} from "../../state/selectors";

const mapStateToProps = (state) => ({
  color: state.ui.paint.color,
  frame: state.ui.paint.frame,
  grid: state.ui.paint.grid,
  layer: state.ui.paint.layer,
  layers: getFrameLayersZSorted(state),
  onion: state.ui.paint.onion.active,
  onionFrameAbsolute: getOnionFrameAbsolute(state),
  pixels: state.file.pixels,
  size: state.file.size,
  tool: state.ui.paint.tool,
  zoom: state.ui.paint.zoom,
});

const mapDispatchToProps = (dispatch) => ({
  pixelsAdd: (frame, layer, pixels) => dispatch(pixelsAdd(frame, layer, pixels)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stagebox);
