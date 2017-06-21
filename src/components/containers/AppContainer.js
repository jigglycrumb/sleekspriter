import { connect } from "react-redux";
import App from "../common/App";

import { Hotkeys } from "../../classes";

// console.log(Hotkeys);


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
