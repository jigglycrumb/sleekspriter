import { connect } from "react-redux";
import ScreenStart from "../screens/ScreenStart";
import {
  modalShow
} from "../../state/actions";

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    modalShow: (dialog) => dispatch(modalShow(dialog))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenStart);
