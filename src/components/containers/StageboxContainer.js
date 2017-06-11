import { connect } from "react-redux";
import Stagebox from "../paint/Stagebox";

const mapStateToProps = (state) => {
  return {
    grid: state.ui.paint.grid,
    onion: state.ui.paint.onion.active,
    size: state.file.size,
    zoom: state.ui.paint.zoom,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stagebox);
