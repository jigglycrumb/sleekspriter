import { connect } from "react-redux";
import React from "react";
import * as components from "../modals";

const mapStateToProps = (state) => {
  return {
    visible: state.ui.app.modal.visible,
    component: state.ui.app.modal.component
  };
};

const ModalContainer = (props) => {
  const
    style = {
      display: props.visible === true ? "table" : "none",
    },
    Modal = props.component === null
          ? null
          : components[props.component];

  return (
    <div id="Modal" style={style}>
      <div className="inner">
        <Modal />
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps
)(ModalContainer);
