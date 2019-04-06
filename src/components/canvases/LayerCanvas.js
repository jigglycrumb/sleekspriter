import React from "react";
import PropTypes from "prop-types";

import { Color } from "../../classes";
import { CanvasDecorator } from "../decorators";

class LayerCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.hasMaxSize = this.props.maxSize !== undefined;
    this.hasZoom = this.props.zoom !== undefined;
  }

  render() {
    let width, height, style;

    if (this.hasMaxSize) {
      const fitted = this.props.fitToSize(this.props.maxSize);
      width = fitted.size.width;
      height = fitted.size.height;
      style = fitted.style;
    } else if (this.hasZoom) {
      width = this.props.size.width * this.props.zoom;
      height = this.props.size.height * this.props.zoom;
      style = {
        width: width,
        height: height,
      };
    }

    return (
      <canvas
        ref={n => (this.canvas = n)}
        width={width}
        height={height}
        style={style}
      />
    );
  }

  componentDidMount() {
    this.paint();
  }

  componentDidUpdate() {
    this.paint();
  }

  paint() {
    this.props.clear();

    if (undefined !== this.props.pixels) {
      const xValues = Object.keys(this.props.pixels);
      xValues.map(x => {
        const yValues = Object.keys(this.props.pixels[x]);
        yValues.map(y => {
          const p = this.props.pixels[x][y];
          const hex = new Color({ rgb: [p.r, p.g, p.b] }).hex();
          this.props.paintSinglePixel(this.canvas, this.props.size, x, y, hex);
        });
      });
    }
  }

  paintPixel(pixel) {
    this.props.paintSinglePixel(
      this.canvas,
      this.props.size,
      pixel.x,
      pixel.y,
      pixel.toHex()
    );
  }

  clearPixel({ x, y }) {
    this.props.clearSinglePixel(this.canvas, this.props.size, x, y);
  }
}

LayerCanvas.propTypes = {
  clear: PropTypes.func.isRequired,
  clearSinglePixel: PropTypes.func.isRequired,
  fitToSize: PropTypes.func.isRequired,
  maxSize: PropTypes.number,
  paintSinglePixel: PropTypes.func.isRequired,
  pixels: PropTypes.object,
  size: PropTypes.object.isRequired, // { width: x, height: y }
  zoom: PropTypes.number,
};

export { LayerCanvas };
export default CanvasDecorator(LayerCanvas);
