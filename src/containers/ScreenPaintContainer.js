import { connect } from "react-redux";
import { getTotalFrames } from "../state/selectors";
import ScreenPaint from "../views/screens/ScreenPaint";

const mapStateToProps = (state) => {
  return {
    totalFrames: getTotalFrames(state),
  };
};

export default connect(
  mapStateToProps
)(ScreenPaint);
