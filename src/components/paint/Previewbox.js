import React from "react";
import PropTypes from "prop-types";

import { FrameCanvas } from "../canvases";
import { sizeShape } from "../../shapes";

class Previewbox extends React.Component {
  componentDidMount() {
    this.props.registerPreviewCanvas(this.previewCanvas);
  }

  componentDidUpdate() {
    this.props.registerPreviewCanvas(this.previewCanvas);
  }

  render() {
    const maxWidth = 206;
    const maxHeight = 120;

    let maxSize;
    if (this.props.size.width >= this.props.size.height) {
      maxSize = maxWidth; // scale to width
    } else {
      maxSize = maxHeight; // scale to height
    }

    return (
      <FrameCanvas
        ref={n => (this.previewCanvas = n)}
        frame={this.props.frame}
        layers={this.props.layers}
        size={this.props.size}
        maxSize={maxSize}
        noMargin
        pixels={this.props.pixels}
      />
    );
  }
}

Previewbox.propTypes = {
  frame: PropTypes.number.isRequired,
  layers: PropTypes.array.isRequired,
  pixels: PropTypes.object,
  registerPreviewCanvas: PropTypes.func.isRequired,
  size: sizeShape.isRequired,
};

export default Previewbox;
