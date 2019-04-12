import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getModal } from "../../state/selectors";
import * as dialogs from "../modals";

const mapStateToProps = state => {
  const { dialog, visible } = getModal(state);
  return {
    visible,
    dialog,
  };
};

const ModalContainer = props => {
  const style = {
    display: props.visible === true ? "flex" : "none",
  };
  const Dialog = props.dialog === null ? null : dialogs[props.dialog];
  const modalDialog = props.dialog === null ? null : <Dialog />;
  const composedModal =
    props.visible === false ? null : (
      <div id="Modal" style={style}>
        {modalDialog}
      </div>
    );

  return composedModal;
};

ModalContainer.propTypes = {
  dialog: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(ModalContainer);
