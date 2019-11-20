import React from "react";
import PropTypes from "prop-types";

import { LayerCanvas } from "../canvases";
import { sizeShape, layerShape } from "../../shapes";

class MoveToolPreview extends React.Component {
  render() {
    const htmlId = `MoveToolPreview-${this.props.layer.id}`;
    const display = this.props.layer.visible === true ? "block" : "none";
    const style = {
      zIndex: this.props.layer.z,
      opacity: this.props.layer.opacity / 100,
      display,
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

MoveToolPreview.propTypes = {
  layer: layerShape.isRequired,
  size: sizeShape.isRequired,
  zoom: PropTypes.number.isRequired,
  pixels: PropTypes.object,
};

export default MoveToolPreview;
