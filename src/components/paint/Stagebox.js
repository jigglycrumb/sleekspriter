import React from "react";
import classnames from "classnames";
import config from "../../config";
import { FrameCanvas, GridCanvas } from "../canvases";
import { Color, Point } from "../../classes";
import StageboxCursorCanvas from "./StageboxCursorCanvas";
import StageboxLayer from "./StageboxLayer";
const { offset } = config;
import _ from "lodash";

class Stagebox extends React.Component {
  constructor(props) {
    super(props);

    this.mouse = {
      down: false,
    };

    this.cursor = {
      x: 0,
      y: 0
    };

    this.cursorColor = "transparent";

    this.pixels = {};
  }

  render() {
    const
      w = this.props.size.width * this.props.zoom,
      h = this.props.size.height * this.props.zoom,
      centerAreaWidth = window.innerWidth - offset.left - offset.right,
      centerAreaHeight = window.innerHeight - offset.top - offset.bottom;

    let css = {
      width: w,
      height: h,
    };

    const cssClasses = classnames({
      checkerboard: !this.props.image
    });

    if( w > centerAreaWidth ) css.left = 0;
    else css.left = (centerAreaWidth - w)/2;

    if(css.left < 5) css.left = 5;

    if( h > centerAreaHeight ) css.top = 0;
    else css.top = (centerAreaHeight - h)/2;

    if(css.top < 5) css.top = 5;

    let grid = null;
    if(this.props.grid === true) {
      grid =  <GridCanvas
                width={w}
                height={h}
                columns={w / this.props.zoom}
                rows={h / this.props.zoom} />;
    }

    let onion = null;
    if(this.props.onion === true) {
      let pixels;
      try { pixels = this.props.pixels[this.props.onionFrameAbsolute]; }
      catch(e) { pixels = null; }

      onion = <div id="StageBoxOnionCanvas" className="Layer">
                <FrameCanvas
                  frame={this.props.onionFrameAbsolute}
                  size={this.props.size}
                  zoom={this.props.zoom}
                  pixels={pixels} />
              </div>;
    }

    return (
      <div id="StageBox"
        className={cssClasses}
        style={css}
        onMouseDown={::this.mousedown}
        onMouseMove={::this.mousemove}
        onMouseOut={::this.mouseout}
        onMouseUp={::this.mouseup}>

        <StageboxCursorCanvas ref="cursorCanvas" width={w} height={h} zoom={this.props.zoom} />
        {grid}

        {this.props.layers.map(function(layer) {
          let pixels;
          try { pixels = this.props.pixels[this.props.frame][layer.id]; }
          catch(e) { pixels = null; }

          return (
            <StageboxLayer
              key={layer.id}
              layer={layer}
              pixels={pixels}
              size={this.props.size}
              zoom={this.props.zoom}
              ref={`layer_${layer.id}`} />
          );
        }, this)}

        {onion}
      </div>
    );
  }

  mousedown(e) {
    this.mouse.down = true;

    const point = this.getCoordinatesOnImage(e);

    switch(this.props.tool) {
    case "BrushTool":
      this.useBrushTool(point);
      break;
    case "EyedropperTool":
      this.useEyedropperTool();
      break;
    }
  }

  mousemove(e) {
    const point = this.getCoordinatesOnImage(e);
    this.updateCursor(point);

    if(this.mouse.down) {
      switch(this.props.tool) {
      case "BrushTool":
        this.useBrushTool(point);
        break;
      }
    }
  }

  mouseout() {
    this.refs.cursorCanvas.clear();
    this.finishTool();

    document.getElementById("StatusBarCursorX").innerHTML = "X: 0";
    document.getElementById("StatusBarCursorY").innerHTML = "Y: 0";
  }

  mouseup() {
    this.finishTool();
  }


  updateCursor(point) {
    if((point.x > 0 && point.y > 0) &&
    (point.x !== this.cursor.x || point.y !== this.cursor.y)) {
      // update cursor position
      this.cursor = point;
      this.refs.cursorCanvas.drawPixelCursor(point.x, point.y);

      document.getElementById("StatusBarCursorX").innerHTML = `X: ${point.x}`;
      document.getElementById("StatusBarCursorY").innerHTML = `Y: ${point.y}`;

      // update color under cursor
      let cursorColorHex, cursorColorRGB;
      try {
        const
          currentPixel = this.props.pixels[this.props.frame][this.props.layer][point.x][point.y],
          cursorColor = new Color({ rgb: [ currentPixel.r, currentPixel.g, currentPixel.b ]});
        cursorColorHex = cursorColor.hex();
        cursorColorRGB = cursorColor.rgbHuman();
      } catch(e) {
        cursorColorHex = "transparent";
        cursorColorRGB = "-, -, -";
      }

      this.cursorColor = cursorColorHex;

      document.getElementById("StatusBarColor").style.backgroundColor = cursorColorHex;
      document.getElementById("StatusBarColorString").innerHTML = cursorColorHex;

      if(this.props.tool == "EyedropperTool") {
        document.getElementById("EyedropperSwatch").style.backgroundColor = cursorColorHex;
        document.getElementById("EyedropperHex").innerHTML = cursorColorHex;
        document.getElementById("EyedropperRGB").innerHTML = cursorColorRGB;
      }
    }
  }

  getCoordinatesOnImage({ nativeEvent }) {
    return new Point(
      Math.ceil(nativeEvent.layerX / this.props.zoom),
      Math.ceil(nativeEvent.layerY / this.props.zoom)
    );
  }

  finishTool() {
    if(this.mouse.down) {
      switch(this.props.tool) {
      case "BrushTool":
        this.props.pixelsAdd(this.props.frame, this.props.layer, this.pixels);
        this.pixels = {};
        break;
      }

      this.mouse.down = false;
    }
  }

  useBrushTool(point) {
    const
      rgb = new Color({hex: this.props.color}),
      p = {
        frame: this.props.frame,
        layer: this.props.layer,
        x: point.x,
        y: point.y,
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        a: 1,
      };

    _.merge(this.pixels, {
      [point.x]: {
        [point.y]: p
      }
    });

    const layerCanvas = this.refs[`layer_${this.props.layer}`].refs.layerCanvas.refs.decoratoredCanvas;
    layerCanvas.paintPixel({x: p.x, y: p.y, layer: this.props.layer, color: this.props.color});
  }

  useEyedropperTool() {
    if(this.cursorColor == "transparent") return;
    this.props.toolSelect("BrushTool");
    this.props.brushColor(this.cursorColor);
  }
}

export default Stagebox;
