import React from "react";
import PropTypes from "prop-types";
import { FrameCanvas } from "../canvases";

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

    let pixels;
    try {
      pixels = this.props.pixels[this.props.frame];
    } catch (e) {
      pixels = null;
    }

    return (
      <FrameCanvas
        ref={n => (this.previewCanvas = n)}
        frame={this.props.frame}
        layers={this.props.layers}
        size={this.props.size}
        maxSize={maxSize}
        noMargin
        pixels={pixels}
      />
    );
  }
}

Previewbox.propTypes = {
  frame: PropTypes.number.isRequired,
  layers: PropTypes.array.isRequired,
  pixels: PropTypes.object.isRequired,
  registerPreviewCanvas: PropTypes.func.isRequired,
  size: PropTypes.object.isRequired,
};

export default Previewbox;
