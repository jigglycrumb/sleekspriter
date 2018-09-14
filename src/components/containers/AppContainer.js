import { connect } from "react-redux";
import { Hotkeys } from "../../classes";
import App from "../common/App";

import { getScreen } from "../../state/selectors";

const mapStateToProps = state => ({
  screen: getScreen(state),
});

const mapDispatchToProps = dispatch => {
  Hotkeys.init(dispatch);
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
