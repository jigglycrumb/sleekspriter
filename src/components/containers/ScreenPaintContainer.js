import { connect } from "react-redux";
import { getTotalFrames } from "../../state/selectors";
import ScreenPaint from "../screens/ScreenPaint";

const mapStateToProps = (state) => ({
  totalFrames: getTotalFrames(state),
});

export default connect(
  mapStateToProps
)(ScreenPaint);
