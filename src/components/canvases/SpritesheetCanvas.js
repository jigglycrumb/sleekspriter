import React from "react";
import PropTypes from "prop-types";
import { Color } from "../../classes";
import { CanvasDecorator } from "../decorators";

class SpritesheetCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.hasMaxSize = this.props.maxSize != undefined;
  }

  render() {
    let width, height, style;
    const { frames, size, zoom, maxSize, fitToSize } = this.props;

    if(!this.hasMaxSize) {
      width = frames.x * size.width * zoom;
      height = frames.y * size.height * zoom;
      style = {
        width: width,
        height: height,
      };
    }
    else {
      const fitted = fitToSize(maxSize);
      width = fitted.size.width;
      height = fitted.size.height;
      style = fitted.style;
    }

    return <canvas ref="canvas" width={width} height={height} style={style}></canvas>;
  }

  componentDidMount() {
    this.paint();
  }

  componentDidUpdate() {
    this.paint();
  }

  paint() {
    this.props.clear();

    const
      { background } = this.props,
      canvas = this.refs.canvas,
      pixels = [],
      layerDict = [];

    if(background) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    this.props.layers.forEach(function(layer) {
      layerDict[layer.id] = { visible: layer.visible, opacity: layer.opacity, z: layer.z };
    }, this);

    // sort pixels via z value
    let
      dict = this.props.pixels,
      flen, llen, xlen, ylen,
      frames, f, frame,
      layers, l, layer,
      xValues, x, xValue,
      yValues, y, yValue,
      zValue, pixel;

    frames = Object.keys(dict);
    flen = frames.length;

    for(f = 0; f < flen; f++) {
      frame = frames[f];

      layers = Object.keys(dict[frame]);
      llen = layers.length;

      for(l = 0; l < llen; l++) {
        layer = layers[l];

        zValue = layerDict[layer].z;

        xValues = Object.keys(dict[frame][layer]);
        xlen = xValues.length;

        for(x = 0; x < xlen; x++) {
          xValue = xValues[x];

          yValues = Object.keys(dict[frame][layer][xValue]);
          ylen = yValues.length;

          for(y = 0; y < ylen; y++) {
            yValue = yValues[y];
            pixel = Object.assign({}, dict[frame][layer][xValue][yValue]);

            if(!pixels[zValue]) pixels[zValue] = [];
            pixels[zValue].push(pixel);
          }
        }
      }
    }

    // paint
    pixels.forEach(function(zLayer) {
      zLayer.forEach(function(px) {
        if(layerDict[px.layer].visible === true) {
          const
            targetPos = this.getPixelSpritesheetPosition(px),
            // alpha = px.a * (layerDict[px.layer].opacity / 100), // TODO integrate layer alpha support
            hex = new Color({rgb: [px.r, px.g, px.b]}).hex(),
            sheetSize = this.getSpriteSheetSize(this.props.size, this.props.frames);

          this.props.paintSinglePixel(canvas, sheetSize, targetPos.x, targetPos.y, hex);

          // Pixel.paint(canvas, targetPos.x, targetPos.y, px.toHex(), alpha, zoom);
        }
      }, this);
    }, this);
  }

  getPixelSpritesheetPosition(pixel) {
    const { frames, size } = this.props;

    const x = pixel.frame % frames.x;
    const framePos = {
      x: x === 0 ? frames.x : x,
      y: Math.ceil(pixel.frame / frames.x),
    };

    const targetPos = {
      x: ((framePos.x-1) * size.width) + pixel.x,
      y: ((framePos.y-1) * size.height) + pixel.y,
    };

    return targetPos;
  }

  getSpriteSheetSize(size, frames) {
    return {
      width: size.width * frames.x,
      height: size.height * frames.y
    };
  }
}

SpritesheetCanvas.propTypes = {
  background: PropTypes.string,
  frames: PropTypes.object.isRequired, // { x, y }
  layers: PropTypes.array.isRequired, // array of file layers
  maxSize: PropTypes.number,
  size: PropTypes.object.isRequired, // { width, height }
  zoom: PropTypes.number,
};

export default CanvasDecorator(SpritesheetCanvas);
