import { connect } from "react-redux";
import Statusbar from "../paint/Statusbar";

import { gridToggle } from "../../state/actions";

const mapStateToProps = (state) => ({
  frame: state.ui.paint.frame,
  grid: state.ui.paint.grid,
  zoom: state.ui.paint.zoom
});

const mapDispatchToProps = (dispatch) => ({
  gridToggle: () => dispatch(gridToggle())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Statusbar);
