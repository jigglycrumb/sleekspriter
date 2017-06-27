import { connect } from "react-redux";
import Stagebox from "../paint/Stagebox";

const mapStateToProps = (state) => ({
  grid: state.ui.paint.grid,
  onion: state.ui.paint.onion.active,
  size: state.file.size,
  zoom: state.ui.paint.zoom
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stagebox);
