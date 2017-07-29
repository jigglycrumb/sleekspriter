import { connect } from "react-redux";
import { Hotkeys } from "../../classes";
import App from "../common/App";

const mapStateToProps = (state) => ({
  screen: state.ui.app.screen,
});

const mapDispatchToProps = (dispatch) => {
  Hotkeys.init(dispatch);
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
