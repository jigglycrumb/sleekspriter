import { connect } from "react-redux";
import { getTotalFrames } from "../../state/selectors";
import ScreenExport from "../screens/ScreenExport";

const mapStateToProps = (state) => ({
  totalFrames: getTotalFrames(state),
});

export default connect(
  mapStateToProps
)(ScreenExport);
