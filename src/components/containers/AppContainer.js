import { connect } from "react-redux";
import App from "../common/App";

const mapStateToProps = (state) => ({
  tab: state.ui.app.tab,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
