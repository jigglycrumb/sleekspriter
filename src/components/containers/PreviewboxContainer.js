import { connect } from "react-redux";
import Previewbox from "../paint/Previewbox";

const mapStateToProps = (state) => ({
  frame: state.ui.paint.frame,
  pixels: state.file.pixels,
  size: state.file.size,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Previewbox);
