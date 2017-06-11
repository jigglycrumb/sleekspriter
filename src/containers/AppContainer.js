import { connect } from "react-redux";
import App from "../views/App";

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
