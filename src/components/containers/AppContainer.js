import { connect } from "react-redux";
import { Hotkeys } from "../../classes";
import App from "platform-specific/App";

import { getScreen } from "../../state/selectors";
import { windowResize } from "../../state/actions";

const mapStateToProps = state => ({
  screen: getScreen(state),
});

const mapDispatchToProps = dispatch => {
  Hotkeys.init(dispatch);
  return {
    windowResize: () => dispatch(windowResize()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
