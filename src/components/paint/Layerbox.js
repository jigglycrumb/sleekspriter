import React from "react";
import LayerboxLayer from "./LayerboxLayer";
import { t } from "../../utils";

class Layerbox extends React.Component {
  constructor(props) {
    super(props);
    this.layerAdd = this.layerAdd.bind(this);
    this.confirmLayerDelete = this.confirmLayerDelete.bind(this);
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
                key={`layer-${i}`}
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
              />
            );
          })}
        </div>
        <div className="actions">
          <button
            title={t("New layer above selected layer")}
            className="tiny transparent"
            onClick={this.layerAdd}>
            <i className="flaticon-plus25" />
          </button>
          <button
            title={t("Delete selected layer")}
            className="tiny transparent"
            disabled={deleteButtonDisabled}
            onClick={this.confirmLayerDelete}>
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

  confirmLayerDelete() {
    this.props.modalShow("ModalConfirmDeleteLayer");
  }

  layerAdd() {
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

export default Layerbox;
