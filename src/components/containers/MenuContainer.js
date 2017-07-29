import { connect } from "react-redux";
import Menu from "../common/Menu";
import {
  modalShow
} from "../../state/actions";

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    modalShow: (modal) => dispatch(modalShow(modal)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
