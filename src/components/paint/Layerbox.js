import React from "react";
import LayerboxLayer from "./LayerboxLayer";
import { t } from "../../utils";

class Layerbox extends React.Component {
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

            console.log(layer, pixels);

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
              />
            );
          })}
        </div>
        <div className="actions">
          <button
            title={t("New layer above selected layer")}
            className="tiny transparent"
            onClick={::this.layerAdd}
          >
            <i className="flaticon-plus25" />
          </button>
          <button
            title={t("Delete selected layer")}
            className="tiny transparent"
            disabled={deleteButtonDisabled}
            onClick={::this.confirmLayerDelete}
          >
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
  }

  confirmLayerDelete() {
    this.props.modalShow("ModalConfirmDeleteLayer");
  }

  layerAdd() {
    this.props.layerAdd(
      this.props.frame,
      this.props.selected,
      this.props.layers
    );
    // TODO: select newly added layer
  }

  fitHeight() {
    const height =
      document.querySelector(".area.right").clientHeight -
      document.getElementById("PreviewBox").clientHeight -
      document.getElementById("FrameBox").clientHeight -
      46;

    this.layerList.style.height = height + "px";
  }
}

export default Layerbox;
