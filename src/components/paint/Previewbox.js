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
    const maxWidth = 206,
      maxHeight = 120;

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
        noMargin={true}
        pixels={pixels}
      />
    );
  }
}

Previewbox.propTypes = {
  size: PropTypes.object.isRequired,
  pixels: PropTypes.object.isRequired,
  layers: PropTypes.array.isRequired,
  frame: PropTypes.number.isRequired,
};

export default Previewbox;
