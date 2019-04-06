import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { t } from "../../utils";
import {
  getPaintFrame,
  getPaintLayer,
  getFilePixels,
  getFrameLayers,
} from "../../state/selectors";
import { layerDelete, modalHide } from "../../state/actions";

const mapStateToProps = state => ({
  frame: getPaintFrame(state),
  layer: getPaintLayer(state),
  layers: getFrameLayers(state),
  pixels: getFilePixels(state),
});

const mapDispatchToProps = dispatch => ({
  layerDelete: (frame, layer, allPixels) =>
    dispatch(layerDelete(frame, layer, allPixels)),
  hide: () => dispatch(modalHide()),
});

class ModalConfirmDeleteLayer extends React.Component {
  constructor(props) {
    super(props);
    this.layerDelete = this.layerDelete.bind(this);
  }

  render() {
    if (this.props.layer === null || this.props.layer === undefined)
      return null;

    const { name } = this.props.layer;
    return (
      <div className="dialog">
        <div className="title">{t("Confirmation needed")}</div>
        <div className="text">
          {t("Are you sure you want to delete the layer ${name}?", { name })}
        </div>
        <div className="actions">
          <button onClick={this.layerDelete}>{t("Delete layer")}</button>
          <button onClick={this.props.hide}>{t("Cancel")}</button>
        </div>
      </div>
    );
  }

  layerDelete() {
    const {
      layerDelete,
      frame,
      layer: { id },
      pixels,
      hide,
    } = this.props;
    layerDelete(frame, id, pixels);
    hide();
  }
}

ModalConfirmDeleteLayer.propTypes = {
  layerDelete: PropTypes.func.isRequired,
  frame: PropTypes.number.isRequired,
  layer: PropTypes.object.isRequired,
  pixels: PropTypes.object,
  hide: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalConfirmDeleteLayer);
