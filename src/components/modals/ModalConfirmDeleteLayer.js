import React from "react";
import { connect } from "react-redux";
import { t } from "../../utils";
import { getSelectedPaintLayer } from "../../state/selectors";
import { layerDelete, modalHide } from "../../state/actions";

const mapStateToProps = (state) => ({
  layer: getSelectedPaintLayer(state),
});

const mapDispatchToProps = (dispatch) => ({
  layerDelete: (layer) => dispatch(layerDelete(layer)),
  hide: () => dispatch(modalHide()),
});

class ModalConfirmDeleteLayer extends React.Component {
  render() {
    const { name } = this.props.layer;
    return (
      <div className="dialog">
        <div className="title">{t("Confirmation needed")}</div>
        <div className="text">{t("Are you sure you want to delete the layer ${name}?", {name})}</div>
        <div className="actions">
          <button onClick={::this.layerDelete}>{t("Delete layer")}</button>
          <button onClick={this.props.hide}>{t("Cancel")}</button>
        </div>
      </div>
    );
  }

  layerDelete() {
    this.props.layerDelete(this.props.layer.id);
    // TODO: Select top layer or layer above deleted
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalConfirmDeleteLayer);
