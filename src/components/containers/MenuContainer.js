import { connect } from "react-redux";
import Menu from "../common/Menu";
import {
  modalShow,
  selectionClear,
  selectionEnd,
  selectionStart,
} from "../../state/actions";

const mapStateToProps = (state) => {
  return {
    size: state.file.size
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    modalShow: (modal) => dispatch(modalShow(modal)),
    selectionClear: () => dispatch(selectionClear()),
    selectionEnd: (point) => dispatch(selectionEnd(point)),
    selectionStart: (point) => dispatch(selectionStart(point)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
