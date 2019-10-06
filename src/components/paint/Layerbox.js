import React from "react";
import PropTypes from "prop-types";

import LayerboxLayer from "./LayerboxLayer";
import { sizeShape } from "../../shapes";
import { t } from "../../utils";

class Layerbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleLayerCreate = this.handleLayerCreate.bind(this);
    this.handleLayerDelete = this.handleLayerDelete.bind(this);
  }

  render() {
    const deleteButtonDisabled =
      this.props.layers.length <= 1 || this.props.selected === null;

    return (
      <div>
        <div className="layers" ref={n => (this.layerList = n)}>
          {this.props.layers.map((layer, i) => {
            let pixels;
            try {
              pixels = this.props.pixels[this.props.frame][layer.id];
            } catch (e) {
              pixels = null;
            }

            return (
              <LayerboxLayer
                key={layer.id}
                layer={layer}
                layerCount={this.props.layers.length}
                pixels={pixels}
                position={i}
                selected={layer.id === this.props.selected}
                size={this.props.size}
                layerMoveDown={this.props.layerMoveDown}
                layerMoveUp={this.props.layerMoveUp}
                layerName={this.props.layerName}
                layerOpacity={this.props.layerOpacity}
                layerSelect={this.props.layerSelect}
                layerVisibility={this.props.layerVisibility}
                registerLayerCanvas={this.props.registerLayerCanvas}
                unregisterLayerCanvas={this.props.unregisterLayerCanvas}
              />
            );
          })}
        </div>
        <div className="actions">
          <button
            title={t("New layer above selected layer")}
            className="tiny transparent"
            onClick={this.handleLayerCreate}>
            <i className="flaticon-plus25" />
          </button>
          <button
            title={t("Delete selected layer")}
            className="tiny transparent"
            disabled={deleteButtonDisabled}
            onClick={this.handleLayerDelete}>
            <i className="flaticon-minus18" />
          </button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.props.layerSelectTop(this.props.layers);
  }

  componentDidUpdate() {
    this.fitHeight();
    if (this.props.selected === null) {
      this.props.layerSelectTop(this.props.layers);
    }
  }

  handleLayerDelete() {
    this.props.modalShow("ModalConfirmDeleteLayer");
  }

  handleLayerCreate() {
    const { layerAdd, newLayerId, frame, selected, layers } = this.props;
    layerAdd(newLayerId, frame, selected, layers);
  }

  fitHeight() {
    let height =
      document.querySelector(".area.right").clientHeight -
      document.getElementById("PreviewBox").clientHeight -
      46;

    if (document.getElementById("FrameBox")) {
      height -= document.getElementById("FrameBox").clientHeight;
    }

    this.layerList.style.height = height + "px";
  }
}

Layerbox.propTypes = {
  frame: PropTypes.number.isRequired,
  layers: PropTypes.array.isRequired,
  layerAdd: PropTypes.func.isRequired,
  layerMoveDown: PropTypes.func.isRequired,
  layerMoveUp: PropTypes.func.isRequired,
  layerName: PropTypes.func.isRequired,
  layerOpacity: PropTypes.func.isRequired,
  layerSelect: PropTypes.func.isRequired,
  layerSelectTop: PropTypes.func.isRequired,
  layerVisibility: PropTypes.func.isRequired,
  modalShow: PropTypes.func.isRequired,
  newLayerId: PropTypes.number.isRequired,
  pixels: PropTypes.object,
  registerLayerCanvas: PropTypes.func.isRequired,
  selected: PropTypes.number,
  size: sizeShape.isRequired,
  unregisterLayerCanvas: PropTypes.func.isRequired,
};

export default Layerbox;
