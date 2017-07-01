import React from "react";
import PropTypes from "prop-types";
import { Color } from "../../classes";
import { CanvasDecorator } from "../decorators";

class FrameCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.hasMaxSize = this.props.maxSize != undefined,
    this.hasNoMargin = this.props.noMargin != undefined;
  }

  render() {
    let width, height, style;

    if(!this.hasMaxSize) {
      width = this.props.size.width * this.props.zoom;
      height = this.props.size.height * this.props.zoom;
      style = {
        width: width,
        height: height,
      };
    }
    else {
      const fitted = this.props.fitToSize(this.props.maxSize, this.hasNoMargin);
      width = fitted.size.width;
      height = fitted.size.height;
      style = fitted.style;
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
      const layers = Object.keys(this.props.pixels);
      layers.map(layer => {
        const xValues = Object.keys(this.props.pixels[layer]);
        xValues.map(x => {
          const yValues = Object.keys(this.props.pixels[layer][x]);
          yValues.map(y => {
            const
              p = this.props.pixels[layer][x][y],
              hex = new Color({rgb: [p.r, p.g, p.b]}).hex();
            this.props.paintSinglePixel(this.refs.canvas, this.props.size, x, y, hex);
          });
        });
      });
    }
  }
}

FrameCanvas.propTypes = {
  frame: PropTypes.number.isRequired,
  maxSize: PropTypes.number,
  size: PropTypes.object.isRequired, // { width: x, height: y }
  zoom: PropTypes.number,
};

export default CanvasDecorator(FrameCanvas);
