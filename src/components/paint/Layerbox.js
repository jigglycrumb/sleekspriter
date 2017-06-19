import React from "react";
import LayerboxLayer from "./LayerboxLayer";
import { t } from "../../utils";

class Layerbox extends React.Component {
  render() {
    let deleteButtonDisabled = this.props.layers.length <= 1;

    return (
      <div>
        <div ref="layers" className="layers">
        {this.props.layers.map((layer, i) => {
          return <LayerboxLayer
            key={`layer-${i}`}
            layer={layer}
            layerCount={this.props.layers.length}
            position={i}
            selected={layer.id === this.props.selected}
            layerName={this.props.layerName}
            layerOpacity={this.props.layerOpacity}
            layerSelect={this.props.layerSelect}
            layerVisibility={this.props.layerVisibility} />;
        })}
        </div>
        <div className="actions">
          <button title={t("New layer above selected layer")} className="tiny transparent" onClick={::this.layerAdd}>
            <i className="flaticon-plus25"></i>
          </button>
          <button title={t("Delete selected layer")} className="tiny transparent" disabled={deleteButtonDisabled} onClick={::this.confirmLayerDelete}>
            <i className="flaticon-minus18"></i>
          </button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.fitHeight();
    this.props.layerSelectTop(this.props.layers);
  }

  componentDidUpdate() {
    this.fitHeight();
  }

  fitHeight() {
    // fit height to available space
    const
      areaRightHeight = document.querySelector(".area.right").clientHeight,
      otherBoxesHeight = document.getElementById("layerboxhelper").clientHeight,
      height = areaRightHeight - otherBoxesHeight - 47;

    this.refs.layers.style.height = `${height}px`;
  }

  confirmLayerDelete() {
    this.props.modalShow("ModalConfirmDeleteLayer");
  }

  layerAdd() {
    this.props.layerAdd(this.props.frame, this.props.selected, this.props.layers);
    // this.props.layerSelectTop(this.props.layers);
  }
}

export default Layerbox;
