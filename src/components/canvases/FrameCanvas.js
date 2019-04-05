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

  mapLayers() {
    // cache all layer z values by layer id
    let zMap = {};

    // cache all layer visible values
    let vMap = {};

    if (this.props.layers) {
      this.props.layers.forEach(layer => {
        zMap[layer.id] = layer.z;
        vMap[layer.id] = layer.visible;
      });
    }

    return {
      zMap,
      vMap,
    };
  }

  paint() {
    // console.log("FrameCanvas paint!", this.canvas, this.props.pixels);
    this.props.clear();

    if (this.props.background) {
      const canvas = this.canvas,
        ctx = canvas.getContext("2d");
      ctx.fillStyle = this.props.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (undefined !== this.props.pixels) {
      const pixels = this.mapPixels();
      const xValues = Object.keys(pixels);
      xValues.map(x => {
        const yValues = Object.keys(pixels[x]);
        yValues.map(y => {
          const p = pixels[x][y][0];
          this.props.paintSinglePixel(
            this.canvas,
            this.props.size,
            x,
            y,
            p.toHex()
          );
        });
      });
    }
  }

  insertPixelInZOrder(zMap, pixels, pixel) {
    // find index to put pixel
    const findNextHigherZ = p => zMap[p.layer] > zMap[pixel.layer];
    const index = pixels.findIndex(findNextHigherZ);

    // insert pixel
    if (index === -1) {
      pixels.unshift(pixel);
    } else {
      pixels.splice(index + 1, 0, pixel);
    }

    return pixels;
  }

  mapPixels() {
    const { zMap, vMap } = this.mapLayers();

    // loop over all flattened pixels and create a map
    // containing the an array of pixels for each x/y-coordinate
    // the array contains all pixels z-sorted, by highest z first
    let pMap = {};

    flattenPixels(this.props.pixels || {}).forEach(pixel => {
      // if layer is visible
      if (vMap[pixel.layer] === true) {
        let pixels = sprout.get(pMap, [pixel.x, pixel.y], []);

        if (pixels.length === 0) pixels = [pixel];
        else {
          pixels = this.insertPixelInZOrder(zMap, pixels, pixel);
        }

        pMap = sprout.assoc(pMap, [pixel.x, pixel.y], pixels);
      }
    });

    return pMap;
  }

  paintPixel(pixel) {
    const { zMap, vMap } = this.mapLayers();

    const { x, y } = pixel;
    const pMap = this.mapPixels();

    // if layer is visible
    if (vMap[pixel.layer] === true) {
      let pixels = sprout.get(pMap, [x, y], []);

      if (pixels.length === 0)
        this.props.paintSinglePixel(
          this.canvas,
          this.props.size,
          x,
          y,
          pixel.toHex()
        );
      else {
        pixels = this.insertPixelInZOrder(zMap, pixels, pixel);
        const p = pixels[0];

        this.props.paintSinglePixel(
          this.canvas,
          this.props.size,
          p.x,
          p.y,
          p.toHex()
        );
      }
    }
  }

  clearPixel(pixel) {
    // console.log("clear", pixel);
    const { vMap } = this.mapLayers();

    const { x, y } = pixel;
    const pMap = this.mapPixels();

    // if layer is visible
    if (vMap[pixel.layer] === true) {
      let pixels = sprout.get(pMap, [x, y], []);

      if (pixels.length > 0) {
        const findPixel = p => p.layer === pixel.layer;
        const index = pixels.findIndex(findPixel);

        pixels.splice(index, 1);

        if (pixels.length === 0) {
          this.props.clearSinglePixel(this.canvas, this.props.size, x, y);
        } else {
          const p = pixels[0];

          this.props.paintSinglePixel(
            this.canvas,
            this.props.size,
            p.x,
            p.y,
            p.toHex()
          );
        }
      }
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
