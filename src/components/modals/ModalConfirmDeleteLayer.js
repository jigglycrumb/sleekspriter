import React from "react";
import { connect } from "react-redux";
import { t } from "../../utils";
import {
  getPaintLayer,
  getFrameLayers,
} from "../../state/selectors";
import {
  layerDelete,
  layerSelectTop,
  modalHide
} from "../../state/actions";

const mapStateToProps = (state) => ({
  layer: getPaintLayer(state),
  layers: getFrameLayers(state),
});

const mapDispatchToProps = (dispatch) => ({
  layerDelete: (layer) => dispatch(layerDelete(layer)),
  layerSelectTop: (layers) => dispatch(layerSelectTop(layers)),
  hide: () => dispatch(modalHide()),
});

class ModalConfirmDeleteLayer extends React.Component {
  render() {
    if(this.props.layer === null || this.props.layer === undefined) return null;

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
    setTimeout(() => {
      this.props.layerSelectTop(this.props.layers);
      this.props.hide();
    }, 100);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalConfirmDeleteLayer);
