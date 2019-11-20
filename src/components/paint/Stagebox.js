import React from "react";
import PropTypes from "prop-types";
import { get } from "sprout-data";

import classnames from "classnames";
import config from "../../config";
import { FrameCanvas, GridCanvas } from "../canvases";
import { Color, Point, Pixel } from "../../classes";
import MoveToolPreview from "./MoveToolPreview";
import StageboxCursorCanvas from "./StageboxCursorCanvas";
import StageboxSelectionCanvas from "./StageboxSelectionCanvas";
import StageboxLayer from "./StageboxLayer";
import { isEqual, merge } from "lodash";
import {
  createBounds,
  createSelection,
  getPixelsInScope,
  hasDistance,
  insideBounds,
  manipulatePixels,
  movePixel,
  selectionIsActive,
  translateSelection,
} from "../../utils";
import PaintbucketWorker from "../../workers/paintbucket";
import { sizeShape, selectionShape } from "../../shapes";

class Stagebox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      moveToolLayer: null,
      moveToolPixels: null,
      moveToolSelection: null,
    };

    this.mouse = {
      down: false,
      downStart: { x: 0, y: 0 },
    };

    this.cursor = {
      x: 0,
      y: 0,
    };

    this.cursorColor = "transparent";

    this.pixels = {}; // a map of pixels filled by the tools and then batch-sent to redux
    this.layerVisibilityMap = {}; // a helper map for easy access to layer visibilty
    this.layers = {}; // layer refs

    this.lastCursorPosition = null; // used in MoveTool

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);

    // setup worker
    this.worker = new PaintbucketWorker();

    this.worker.onmessage = m => {
      document.getElementById("ScreenBlocker").style.display = "none";
      this.props.pixelsAdd(this.props.frame, this.props.layer, m.data);
      this.props.fileDirty(true);
    };

    this.worker.onfail = e => {
      console.error(
        `worker failed in line ${e.lineno} with message: ${e.message}`
      );
      document.getElementById("ScreenBlocker").style.display = "none";
    };
  }

  render() {
    const { onionFrameAbsolute, size, zoom } = this.props;
    const w = size.width * zoom;
    const h = size.height * zoom;
    const centerAreaWidth =
      window.innerWidth - config.offset.left - config.offset.right;
    const centerAreaHeight =
      window.innerHeight - config.offset.top - config.offset.bottom;

    const style = {
      width: w,
      height: h,
    };

    if (w > centerAreaWidth) style.left = 0;
    else style.left = Math.floor((centerAreaWidth - w) / 2);

    if (h > centerAreaHeight) style.top = 0;
    else style.top = Math.floor((centerAreaHeight - h) / 2);

    const cssClasses = classnames({
      checkerboard: !this.props.image,
    });

    let onion = null;
    if (this.props.onion === true) {
      let pixels;
      try {
        pixels = this.props.pixels[onionFrameAbsolute];
      } catch (e) {
        pixels = null;
      }

      onion = (
        <div id="StageBoxOnionCanvas" className="Layer">
          <FrameCanvas
            frame={onionFrameAbsolute}
            layers={this.props.onionFrameLayers}
            size={size}
            zoom={zoom}
            pixels={pixels}
          />
        </div>
      );
    }

    return (
      <div
        id="StageBox"
        className={cssClasses}
        style={style}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseOut={this.handleMouseOut}
        onMouseUp={this.handleMouseUp}>
        <StageboxCursorCanvas
          ref={n => (this.cursorCanvas = n)}
          width={w}
          height={h}
          zoom={zoom}
        />
        <StageboxSelectionCanvas
          ref={n => (this.selectionCanvas = n)}
          width={w}
          height={h}
          zoom={zoom}
          selection={this.state.moveToolSelection || this.props.selection}
        />
        {this.props.grid && (
          <GridCanvas width={w} height={h} columns={w / zoom} rows={h / zoom} />
        )}

        {this.props.layers.map(function(layer) {
          const pixels = this.getLayerPixels(layer.id);

          return (
            <React.Fragment key={layer.id}>
              {layer.id === this.state.moveToolLayer && (
                <MoveToolPreview
                  layer={layer}
                  pixels={this.state.moveToolPixels}
                  size={size}
                  zoom={zoom}
                  ref={n => (this.layers[layer.id] = n)}
                />
              )}
              <StageboxLayer
                layer={layer}
                pixels={pixels}
                size={size}
                zoom={zoom}
                ref={n => (this.layers[layer.id] = n)}
              />
            </React.Fragment>
          );
        }, this)}

        {onion}
      </div>
    );
  }

  componentDidMount() {
    this.createLayerVisibilityMap();
  }

  componentDidUpdate() {
    this.createLayerVisibilityMap();
  }

  handleMouseDown(e) {
    const point = this.getCoordinatesOnImage(e);

    this.mouse = {
      down: true,
      downStart: point,
    };

    switch (this.props.tool) {
      case "BrushTool":
        this.useBrushTool(point);
        break;
      case "BrightnessTool":
        this.useBrightnessTool(point);
        break;
      case "EraserTool":
        this.useEraserTool(point);
        break;
      case "EyedropperTool":
        this.useEyedropperTool();
        break;
      case "MoveTool":
        this.startMoveTool();
        break;
      case "PaintbucketTool":
        this.usePaintBucketTool(point);
        break;
      case "RectangularSelectionTool":
        this.startRectangularSelection(point);
        break;
      case "ZoomTool":
        this.useZoomTool();
    }
  }

  handleMouseMove(e) {
    const point = this.getCoordinatesOnImage(e);
    this.updateCursor(point);

    if (this.mouse.down) {
      switch (this.props.tool) {
        case "BrushTool":
          this.useBrushTool(point);
          break;
        case "BrightnessTool":
          this.useBrightnessTool(point);
          break;
        case "EraserTool":
          this.useEraserTool(point);
          break;
        case "MoveTool":
          this.useMoveTool();
          break;
        case "RectangularSelectionTool":
          this.resizeRectangularSelection(point);
          break;
      }
    }
  }

  handleMouseOut() {
    this.cursorCanvas.clear();
    this.finishTool();

    document.getElementById("StatusBarCursorX").innerHTML = "X: 0";
    document.getElementById("StatusBarCursorY").innerHTML = "Y: 0";
  }

  handleMouseUp(e) {
    const point = this.getCoordinatesOnImage(e);

    this.updateCursor(point, true);
    this.finishTool();
  }

  updateCursor(point, force = false) {
    const { x, y } = point;

    if (
      x > 0 &&
      y > 0 &&
      (force || x !== this.cursor.x || y !== this.cursor.y)
    ) {
      // update cursor position
      this.cursor = point;
      this.cursorCanvas.drawPixelCursor(x, y);

      document.getElementById("StatusBarCursorX").innerHTML = `X: ${x}`;
      document.getElementById("StatusBarCursorY").innerHTML = `Y: ${y}`;

      // update color under cursor
      let cursorColorHex, cursorColorRGB;

      const currentPixel = get(
        this.pixels,
        [x, y],
        get(
          this.props.pixels,
          [this.props.frame, this.props.layer, x, y],
          undefined
        )
      );

      if (currentPixel) {
        const cursorColor = new Color({
          rgb: [currentPixel.r, currentPixel.g, currentPixel.b],
        });
        cursorColorHex = cursorColor.hex();
        cursorColorRGB = cursorColor.rgbHuman();
      } else {
        cursorColorHex = "transparent";
        cursorColorRGB = "-, -, -";
      }

      this.cursorColor = cursorColorHex;

      document.getElementById(
        "StatusBarColor"
      ).style.backgroundColor = cursorColorHex;
      document.getElementById(
        "StatusBarColorString"
      ).innerHTML = cursorColorHex;

      if (this.props.tool === "EyedropperTool") {
        document.getElementById(
          "EyedropperSwatch"
        ).style.backgroundColor = cursorColorHex;
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
    if (this.mouse.down) {
      switch (this.props.tool) {
        case "BrushTool":
        case "BrightnessTool":
          this.props.pixelsAdd(this.props.frame, this.props.layer, this.pixels);
          this.props.fileDirty(true);
          this.pixels = {};
          break;
        case "EraserTool":
          this.props.pixelsDelete(
            this.props.frame,
            this.props.layer,
            this.pixels,
            this.props.pixels
          );
          this.props.fileDirty(true);
          this.pixels = {};
          break;
        case "MoveTool":
          this.endMoveTool();

          break;
        case "RectangularSelectionTool":
          this.endRectangularSelection(this.cursor);
          break;
      }

      this.mouse.down = false;
    }
  }

  useBrushTool(point) {
    if (this.layerIsVisible()) {
      if (
        !selectionIsActive(this.props.selection) ||
        insideBounds(this.props.selection, this.cursor)
      ) {
        const color = new Color({ hex: this.props.color });
        const p = {
          frame: this.props.frame,
          layer: this.props.layer,
          x: point.x,
          y: point.y,
          r: color.r,
          g: color.g,
          b: color.b,
          a: 1,
        };

        merge(this.pixels, {
          [point.x]: {
            [point.y]: p,
          },
        });

        const px = new Pixel(p.frame, p.layer, p.x, p.y, p.r, p.g, p.b, p.a);

        this.instantPaintPixel(px);
      }
    }
  }

  useEyedropperTool() {
    if (this.cursorColor === "transparent") return;
    this.props.toolSelect("BrushTool");
    this.props.brushColor(this.cursorColor);
  }

  useBrightnessTool(point) {
    if (this.layerIsVisible()) {
      if (this.cursorColor === "transparent") return;
      if (
        !selectionIsActive(this.props.selection) ||
        insideBounds(this.props.selection, this.cursor)
      ) {
        const intensity =
          this.props.brightnessTool.mode === "lighten"
            ? this.props.brightnessTool.intensity
            : -this.props.brightnessTool.intensity;
        const color = new Color({ hex: this.cursorColor }).changeBrightness(
          intensity
        );
        const p = {
          frame: this.props.frame,
          layer: this.props.layer,
          x: point.x,
          y: point.y,
          r: color.r,
          g: color.g,
          b: color.b,
          a: 1,
        };

        merge(this.pixels, {
          [point.x]: {
            [point.y]: p,
          },
        });

        const px = new Pixel(p.frame, p.layer, p.x, p.y, p.r, p.g, p.b, p.a);

        this.instantPaintPixel(px);
      }
    }
  }

  useEraserTool(point) {
    if (this.layerIsVisible()) {
      if (this.cursorColor === "transparent") return;
      if (
        !selectionIsActive(this.props.selection) ||
        insideBounds(this.props.selection, this.cursor)
      ) {
        const p = get(
          this.props.pixels,
          [this.props.frame, this.props.layer, point.x, point.y],
          undefined
        );

        if (p) {
          merge(this.pixels, {
            [point.x]: {
              [point.y]: p,
            },
          });

          this.instantClearPixel(p);
        }
      }
    }
  }

  useZoomTool() {
    this.props.zoomIn();
  }

  startMoveTool() {
    if (this.layerIsVisible()) {
      const { frame, layer, pixels, selection } = this.props;

      const scopedPixels = getPixelsInScope(frame, layer, pixels, selection);

      this.setState(
        {
          moveToolLayer: layer,
          moveToolPixels: scopedPixels,
          moveToolSelection: selectionIsActive(selection) ? selection : null,
        },
        () => {
          this.props.pixelsDelete(frame, layer, scopedPixels);
        }
      );
    }
  }

  useMoveTool() {
    let distance;
    if (!this.lastCursorPosition) {
      distance = this.getMouseDownDistance();
    } else {
      distance = this.getMouseDownDistance(this.lastCursorPosition);
    }

    if (hasDistance(distance) && this.layerIsVisible()) {
      const { size } = this.props;

      // move pixels on preview layer
      const bounds = createBounds(size, this.state.moveToolSelection);
      const moveToolPixels = manipulatePixels(
        this.state.moveToolPixels,
        movePixel.bind(this, distance, bounds),
        createBounds(size)
      );

      // move selection on preview layer, if active
      const moveToolSelection = this.state.moveToolSelection
        ? translateSelection(this.state.moveToolSelection, distance)
        : null;

      this.setState({
        moveToolSelection,
        moveToolPixels,
      });

      this.props.fileDirty(true);

      this.lastCursorPosition = this.cursor;
    }
  }

  endMoveTool() {
    const { frame, layer, selection } = this.props;
    const distance = this.getMouseDownDistance();

    if (hasDistance(distance) && this.layerIsVisible()) {
      this.props.pixelsMove(frame, layer, this.state.moveToolPixels);

      if (selectionIsActive(selection)) {
        this.props.selectionMove(distance);
      }
    }

    this.lastCursorPosition = null;

    this.setState({
      moveToolLayer: null,
      moveToolPixels: null,
      moveToolSelection: null,
    });
  }

  usePaintBucketTool(point) {
    if (this.layerIsVisible()) {
      if (
        !selectionIsActive(this.props.selection) ||
        insideBounds(this.props.selection, this.cursor)
      ) {
        document.getElementById("ScreenBlocker").style.display = "block";

        let layerZ;
        this.props.layers.map(layer => {
          if (layer.id === this.props.layer) layerZ = layer.z;
        });

        const fillColor = new Color({ hex: this.props.color });
        const pixels = this.getLayerPixels(this.props.layer);

        let bounds;
        if (selectionIsActive(this.props.selection)) {
          bounds = {
            top: this.props.selection.start.y,
            right: this.props.selection.end.x,
            bottom: this.props.selection.end.y,
            left: this.props.selection.start.x,
          };
        } else {
          bounds = {
            top: 1,
            right: this.props.size.width,
            bottom: this.props.size.height,
            left: 1,
          };
        }

        const data = {
          point,
          frame: this.props.frame,
          layer: this.props.layer,
          layerZ,
          fillColor,
          pixels,
          bounds,
        };

        this.worker.postMessage(data);
      }
    }
  }

  startRectangularSelection(point) {
    this.props.selectionStart(point);
  }

  resizeRectangularSelection(point) {
    const { start, end } = createSelection(this.props.selection.start, point);
    this.selectionCanvas.decoratedCanvas.drawSelection(start, end);
  }

  endRectangularSelection(point) {
    if (isEqual(point, this.mouse.downStart)) {
      this.props.selectionClear();
    } else {
      this.props.selectionEnd(point);
    }
  }

  createLayerVisibilityMap() {
    this.layerVisibilityMap = {};
    this.props.layers.map(
      layer =>
        (this.layerVisibilityMap[layer.id] = layer.visible && layer.opacity > 0)
    );
  }

  layerIsVisible() {
    if (!this.layerVisibilityMap[this.props.layer]) {
      this.props.modalShow("ModalErrorInvisibleLayer");
      return false;
    }
    return true;
  }

  getMouseDownDistance(from = this.mouse.downStart) {
    return {
      x: this.cursor.x - from.x,
      y: this.cursor.y - from.y,
    };
  }

  getLayerPixels(layerId) {
    return get(this.props.pixels, [this.props.frame, layerId], {});
  }

  instantPaintPixel(pixel) {
    // paint pixel live

    // stage layer
    const stageLayerCanvas = this.layers[this.props.layer].layerCanvas
      .decoratedCanvas;
    stageLayerCanvas.paintPixel(pixel);

    // layerbox
    const layerBoxCanvas = this.props.externalLayerCanvases[this.props.layer]
      .decoratedCanvas;
    layerBoxCanvas.paintPixel(pixel);

    // preview
    const previewCanvas = this.props.externalPreviewCanvas.decoratedCanvas;
    previewCanvas.paintPixel(pixel);

    // framebox
    const frameboxCanvas = this.props.externalFrameCanvases[this.props.frame];
    if (frameboxCanvas) {
      frameboxCanvas.decoratedCanvas.paintPixel(pixel);
    }
  }

  instantClearPixel(pixel) {
    // clear pixel live

    // stage layer
    const layerCanvas = this.layers[this.props.layer].layerCanvas
      .decoratedCanvas;
    layerCanvas.clearPixel(pixel);

    // layerbox layer
    const layerBoxCanvas = this.props.externalLayerCanvases[this.props.layer]
      .decoratedCanvas;
    layerBoxCanvas.clearPixel(pixel);

    // preview
    const previewCanvas = this.props.externalPreviewCanvas.decoratedCanvas;
    previewCanvas.clearPixel(pixel);

    // framebox
    const frameboxCanvas = this.props.externalFrameCanvases[this.props.frame];
    if (frameboxCanvas) {
      frameboxCanvas.decoratedCanvas.clearPixel(pixel);
    }
  }
}

Stagebox.propTypes = {
  brightnessTool: PropTypes.object.isRequired,
  brushColor: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  externalFrameCanvases: PropTypes.object,
  externalPreviewCanvas: PropTypes.object,
  externalLayerCanvases: PropTypes.object.isRequired,
  fileDirty: PropTypes.func.isRequired,
  frame: PropTypes.number.isRequired,
  grid: PropTypes.bool.isRequired,
  image: PropTypes.bool.isRequired,
  layer: PropTypes.number,
  layers: PropTypes.array.isRequired,
  modalShow: PropTypes.func.isRequired,
  onion: PropTypes.bool.isRequired,
  onionFrameAbsolute: PropTypes.number.isRequired,
  onionFrameLayers: PropTypes.array.isRequired,
  pixels: PropTypes.object,
  pixelsAdd: PropTypes.func.isRequired,
  pixelsDelete: PropTypes.func.isRequired,
  pixelsMove: PropTypes.func.isRequired,
  selection: selectionShape.isRequired,
  selectionClear: PropTypes.func.isRequired,
  selectionEnd: PropTypes.func.isRequired,
  selectionMove: PropTypes.func.isRequired,
  selectionStart: PropTypes.func.isRequired,
  size: sizeShape.isRequired,
  tool: PropTypes.string.isRequired,
  toolSelect: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
  zoomIn: PropTypes.func.isRequired,
};

export default Stagebox;
