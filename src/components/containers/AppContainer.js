import { connect } from "react-redux";
import App from "../common/App";

const mapStateToProps = (state) => {
  return {
    tab: state.ui.app.tab
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
