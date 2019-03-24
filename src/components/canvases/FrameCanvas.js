import React from "react";
import PropTypes from "prop-types";
import { Color } from "../../classes";
import { CanvasDecorator } from "../decorators";

class FrameCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.hasMaxSize = this.props.maxSize != undefined;
    this.hasNoMargin = this.props.noMargin != undefined;
  }

  render() {
    let width, height, style;

    if (!this.hasMaxSize) {
      width = this.props.size.width * this.props.zoom;
      height = this.props.size.height * this.props.zoom;
      style = {
        width: width,
        height: height,
      };
    } else {
      const fitted = this.props.fitToSize(this.props.maxSize, this.hasNoMargin);
      width = fitted.size.width;
      height = fitted.size.height;
      style = fitted.style;
    }

    // setTimeout(() => this.paint, 50);

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
    // console.log("FrameCanvas update!");
    this.paint();
  }

  paint() {
    // console.log("FrameCanvas paint!");
    this.props.clear();

    if (this.props.background) {
      const canvas = this.canvas,
        ctx = canvas.getContext("2d");
      ctx.fillStyle = this.props.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (undefined != this.props.pixels) {
      const layers = Object.keys(this.props.pixels);
      layers.map(layer => {
        const l = this.props.layers.find(fl => fl.id === +layer);
        if (l.visible === true && l.opacity > 0) {
          const xValues = Object.keys(this.props.pixels[layer]);
          xValues.map(x => {
            const yValues = Object.keys(this.props.pixels[layer][x]);
            yValues.map(y => {
              const p = this.props.pixels[layer][x][y],
                hex = new Color({ rgb: [p.r, p.g, p.b] }).hex();
              this.props.paintSinglePixel(
                this.canvas,
                this.props.size,
                x,
                y,
                hex
              );
            });
          });
        }
      });
    }
  }
}

FrameCanvas.propTypes = {
  background: PropTypes.string,
  frame: PropTypes.number.isRequired,
  layers: PropTypes.array,
  maxSize: PropTypes.number,
  noMargin: PropTypes.bool,
  size: PropTypes.object.isRequired, // { width: x, height: y }
  zoom: PropTypes.number,
};

export { FrameCanvas };
export default CanvasDecorator(FrameCanvas);
