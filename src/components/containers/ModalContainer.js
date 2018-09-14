import { connect } from "react-redux";
import React from "react";
import * as dialogs from "../modals";

const mapStateToProps = state => ({
  visible: state.ui.app.modal.visible,
  dialog: state.ui.app.modal.dialog,
});

const ModalContainer = props => {
  const style = {
      display: props.visible === true ? "flex" : "none",
    },
    Dialog = props.dialog === null ? null : dialogs[props.dialog],
    modalDialog = props.dialog === null ? null : <Dialog />,
    composedModal =
      props.visible === false ? null : (
        <div id="Modal" style={style}>
          {modalDialog}
        </div>
      );

  return composedModal;
};

export default connect(mapStateToProps)(ModalContainer);
