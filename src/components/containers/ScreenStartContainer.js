import { connect } from "react-redux";
import { ScreenStart } from "../screens";
import { modalShow } from "../../state/actions";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  modalShow: dialog => dispatch(modalShow(dialog)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenStart);
