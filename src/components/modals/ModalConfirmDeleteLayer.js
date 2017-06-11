import React from "react";
import { connect } from "react-redux";
import {
  modalHide
} from "../../state/actions";
import { t } from "../../utils";

const mapStateToProps = (state) => ({
  layer: state.ui.paint.layer
});

const mapDispatchToProps = (dispatch) => ({
  hide: () => dispatch(modalHide())
});

class ModalConfirmDeleteLayer extends React.Component {
  render() {

    const name = "whargarbl";

    return (
      <div className="dialog">
        <div className="title">{t("Confirmation needed")}</div>
        <div className="text">{t("Are you sure you want to delete the layer ${name}?", {name})}</div>
        <div className="actions">
          <button onClick={::this.deleteLayer}>{t("Delete layer")}</button>
          <button onClick={this.props.hide}>{t("Cancel")}</button>
        </div>
      </div>
    );
  }

  deleteLayer() {
    console.log("deleteLayer", this.props.layer);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalConfirmDeleteLayer);
