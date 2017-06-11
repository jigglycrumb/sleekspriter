import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  layer: state.ui.paint.layer
});

class ModalConfirmDeleteLayer extends React.Component {
  render() {
    return (
      <div>ModalConfirmDeleteLayer</div>
    );
  }
}

export default connect(
  mapStateToProps
)(ModalConfirmDeleteLayer);
