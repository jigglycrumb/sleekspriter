import { connect } from "react-redux";
import { Hotkeys } from "../../classes";
import App from "../common/App";

const mapStateToProps = (state) => ({
  tab: state.ui.app.tab,
});

const mapDispatchToProps = (dispatch) => ({
  bindings: Hotkeys.init(dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
