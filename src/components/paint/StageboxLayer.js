import React from "react";
import { LayerCanvas } from "../canvases";

class StageboxLayer extends React.Component {
  render() {
    const htmlId = `StageBoxLayer-${this.props.layer.id}`,
      display = this.props.layer.visible === true ? "block" : "none",
      style = {
        zIndex: this.props.layer.z,
        opacity: this.props.layer.opacity / 100,
        display
      };

    return (
      <div id={htmlId} className="Layer" style={style}>
        <LayerCanvas
          ref={n => (this.layerCanvas = n)}
          frame={this.props.layer.frame}
          layer={this.props.layer.id}
          size={this.props.size}
          zoom={this.props.zoom}
          pixels={this.props.pixels}
        />
      </div>
    );
  }
}

export default StageboxLayer;
