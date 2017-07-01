import React from "react";
import PropTypes from "prop-types";
import { Color } from "../../classes";
import { CanvasDecorator } from "../decorators";

class LayerCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.hasMaxSize = this.props.maxSize != undefined,
    this.hasZoom = this.props.zoom != undefined;
  }

  render() {
    let width, height, style;

    if(this.hasMaxSize) {
      const fitted = this.props.fitToSize(this.props.maxSize);
      width = fitted.size.width;
      height = fitted.size.height;
      style = fitted.style;
    }
    else if(this.hasZoom) {
      width = this.props.size.width * this.props.zoom;
      height = this.props.size.height * this.props.zoom;
      style = {
        width: width,
        height: height,
      };
    }

    return (
      <canvas ref="canvas" width={width} height={height} style={style}></canvas>
    );
  }

  componentDidMount() {
    this.paint();
  }

  componentDidUpdate() {
    this.paint();
  }

  paint() {
    if(undefined != this.props.pixels) {
      this.props.clear();
      const xValues = Object.keys(this.props.pixels);
      xValues.map(x => {
        const yValues = Object.keys(this.props.pixels[x]);
        yValues.map(y => {
          const
            p = this.props.pixels[x][y],
            hex = new Color({rgb: [p.r, p.g, p.b]}).hex();
          this.props.paintSinglePixel(this.refs.canvas, this.props.size, x, y, hex);
        });
      });
    }
  }

  paintPixel({ x, y, color }) {
    this.props.paintSinglePixel(this.refs.canvas, this.props.size, x, y, color);
  }
}

LayerCanvas.propTypes = {
  layer: PropTypes.number.isRequired,
  maxSize: PropTypes.number,
  size: PropTypes.object.isRequired, // { width: x, height: y }
  zoom: PropTypes.number,
};

export default CanvasDecorator(LayerCanvas);
