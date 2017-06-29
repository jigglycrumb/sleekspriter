import { connect } from "react-redux";
import Stagebox from "../paint/Stagebox";
import {
  pixelsAdd
} from "../../state/actions";

const mapStateToProps = (state) => ({
  frame: state.ui.paint.frame,
  grid: state.ui.paint.grid,
  layer: state.ui.paint.layer,
  onion: state.ui.paint.onion.active,
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
