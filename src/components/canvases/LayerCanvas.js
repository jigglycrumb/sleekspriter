import React from "react";
import PropTypes from "prop-types";
import { Color } from "../../classes";

function paintSinglePixel(canvas, size, x, y, color) {
  const
    alpha = 1,
    scale = canvas.width / size.width,
    cX = (x - 1) * scale,
    cY = (y - 1) * scale,
    ctx = canvas.getContext("2d");
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(cX, cY, scale, scale);
}

class LayerCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.hasMaxSize = this.props.maxSize != undefined,
    this.hasZoom = this.props.zoom != undefined;
  }

  render() {
    let width, height, style;

    if(this.hasMaxSize) {
      const fitted = this.fitToSize(this.props.maxSize);
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

  clear() {
    const canvas = this.refs.canvas;
    canvas.width = canvas.width;
  }

  fitToSize(size, noMargin) {
    let
      w = this.props.size.width,
      h = this.props.size.height,
      style = {},
      scale;

    if(w > h) scale = size/w;
    else scale = size/h;

    if(scale > 1) scale = Math.floor(scale);

    w = Math.round(w*scale);
    h = Math.round(h*scale);

    if(!noMargin) {
      style.marginTop = Math.round((size - h)/2 || 0);
      style.marginLeft = Math.round((size - w)/2 || 0);
    }

    return {
      size: {
        width: w,
        height: h,
      },
      style: style
    };
  }

  paint() {
    if(undefined != this.props.pixels) {
      this.clear();
      const xValues = Object.keys(this.props.pixels);
      xValues.map(x => {
        const yValues = Object.keys(this.props.pixels[x]);
        yValues.map(y => {
          const
            p = this.props.pixels[x][y],
            hex = new Color({rgb: [p.r, p.g, p.b]}).hex();
          paintSinglePixel(this.refs.canvas, this.props.size, x, y, hex);
        });
      });
    }
  }

  paintPixel({ x, y, color }) {
    paintSinglePixel(this.refs.canvas, this.props.size, x, y, color);
  }
}

LayerCanvas.propTypes = {
  layer: PropTypes.number.isRequired,
  maxSize: PropTypes.number,
  size: PropTypes.object.isRequired, // { width: x, height: y }
  zoom: PropTypes.number,
};

export default LayerCanvas;
