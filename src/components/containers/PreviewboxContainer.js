import { connect } from "react-redux";
import Previewbox from "../paint/Previewbox";
import {
  getFilePixels,
  getFileSize
} from "../../state/selectors";

const mapStateToProps = (state) => ({
  frame: state.ui.paint.frame,
  pixels: getFilePixels(state),
  size: getFileSize(state),
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Previewbox);
