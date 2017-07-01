import { connect } from "react-redux";
import ScreenHelper from "../screens/ScreenHelper";

const mapStateToProps = (state) => {
  return {
    frame: state.ui.paint.frame,
    layer: state.ui.paint.layer,
    pixels: state.file.pixels,
    size: state.file.size,
  };
};

export default connect(
  mapStateToProps
)(ScreenHelper);
