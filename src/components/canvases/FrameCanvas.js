import React from "react";
import PropTypes from "prop-types";
import sprout from "sprout-data";
import { Color } from "../../classes";
import { CanvasDecorator } from "../decorators";
import { flattenPixels } from "../../utils";

class FrameCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.hasMaxSize = this.props.maxSize != undefined;
    this.hasNoMargin = this.props.noMargin != undefined;

    this.mapPixels = this.mapPixels.bind(this);
    this.paint = this.paint.bind(this);
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
    // console.log("FrameCanvas mount!", this.props);
    this.paint();
  }

  componentDidUpdate() {
    // console.log("FrameCanvas update!");

    this.paint();
  }

  mapPixels() {
    // cache all layer z values by layer id
    let zMap = {};

    // cache all layer visible values
    let vMap = {};

    this.props.layers.forEach(layer => {
      zMap[layer.id] = layer.z;
      vMap[layer.id] = layer.visible;
    });

    // loop over all flattened pixels and create a map
    // containing the topmost pixel of each coordinate
    let pMap = {};
    flattenPixels(this.props.pixels || {}).forEach(pixel => {
      const oldPixel = sprout.get(pMap, [pixel.x, pixel.y], undefined);
      if (!oldPixel || zMap[oldPixel.layer] < zMap[pixel.layer]) {
        if (vMap[pixel.layer] === true) {
          pMap = sprout.assoc(pMap, [pixel.x, pixel.y], pixel);
        }
      }
    });

    return pMap;
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

    if (undefined !== this.props.pixels) {
      const pixels = this.mapPixels(this.props.pixels);
      const xValues = Object.keys(pixels);
      xValues.map(x => {
        const yValues = Object.keys(pixels[x]);
        yValues.map(y => {
          const p = pixels[x][y],
            hex = new Color({ rgb: [p.r, p.g, p.b] }).hex();
          this.props.paintSinglePixel(this.canvas, this.props.size, x, y, hex);
        });
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
