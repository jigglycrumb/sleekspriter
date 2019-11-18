import React from "react";
import PropTypes from "prop-types";

import { CanvasDecorator } from "../decorators";
import { selectionIsActive } from "../../utils";

const DASH_SIZE = 8;
const LINE_WIDTH = 2;

const COLOR_BG = "white";
const COLOR_DASH = "black";

const DRAW_INTERVAL = 100;

class StageboxSelectionCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      offset: 1,
      offsetIncrease: true,
    };

    this.interval = null;
    this.tick = this.tick.bind(this);
  }

  render() {
    return (
      <canvas
        ref={n => (this.canvas = n)}
        id="StageBoxSelectionCanvas"
        className="Layer"
        width={this.props.width}
        height={this.props.height}
      />
    );
  }

  componentDidMount() {
    // animate the selection by redrawing the selection pattern from offscreen canvas every 200ms
    this.interval = setInterval(this.tick, DRAW_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.props.clear(this.canvas);

    switch (this.props.tool) {
      case "RectangularSelectionTool":
        //   if(storeUtils.selection.isMoving) this.moveSelection(this.props.ui.selection.distance);
        //   else if(storeUtils.selection.isResizing) {
        //     this.drawSelection(this.props.ui.selection.start, this.props.ui.selection.cursor);
        //   }
        //   else if(storeUtils.selection.isActive) this.drawLastSelection();

        if (selectionIsActive(this.props.selection)) {
          this.drawSelection(
            this.props.selection.start,
            this.props.selection.end
          );
        }
        break;
      // case "MoveTool":
      //   if(storeUtils.selection.isMoving) this.moveSelection(this.props.ui.selection.distance);
      //   else if(storeUtils.selection.isActive) this.drawLastSelection();
      //   break;
      default:
        if (selectionIsActive(this.props.selection)) this.drawLastSelection();
        break;
    }

    let offset = this.state.offset;
    let offsetIncrease = this.state.offsetIncrease;

    if (offsetIncrease) {
      offset++;
      if (offset === DASH_SIZE) offsetIncrease = false;
    } else {
      offset--;
      if (offset === 1) offsetIncrease = true;
    }
    this.setState({ offset, offsetIncrease });
  }

  drawSelection(start, end) {
    this.props.clear(this.canvas);

    const canvas = this.canvas;
    const zoom = this.props.zoom;
    const ctx = canvas.getContext("2d");

    let width = end.x - start.x;
    let height = end.y - start.y;
    let sx;
    let sy;

    // TODO: check why this is there, write comment to explain
    if (width >= 0) {
      width++;
      sx = start.x - 1;
    } else {
      width--;
      sx = start.x;
    }

    if (height >= 0) {
      height++;
      sy = start.y - 1;
    } else {
      height--;
      sy = start.y;
    }

    const s = {
      start: {
        x: sx * zoom,
        y: sy * zoom,
      },
      end: {
        x: sx * zoom + width * zoom,
        y: sy * zoom + height * zoom,
      },
    };

    // draw solid background rectangle
    ctx.fillStyle = COLOR_BG;

    ctx.fillRect(
      s.start.x - LINE_WIDTH / 2,
      s.start.y - LINE_WIDTH / 2,
      width * zoom + LINE_WIDTH,
      height * zoom + LINE_WIDTH
    );

    // draw dashed border lines

    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = COLOR_DASH;
    ctx.lineDashOffset = this.state.offset;
    ctx.setLineDash([DASH_SIZE, DASH_SIZE]);

    // top horizontal line
    ctx.beginPath();
    ctx.moveTo(s.start.x, s.start.y);
    ctx.lineTo(s.end.x, s.start.y);
    ctx.stroke();

    // right vertical line
    ctx.beginPath();
    ctx.moveTo(s.end.x, s.start.y);
    ctx.lineTo(s.end.x, s.end.y);
    ctx.stroke();

    // bottom horizontal line
    ctx.beginPath();
    ctx.moveTo(s.end.x, s.end.y);
    ctx.lineTo(s.start.x, s.end.y);
    ctx.stroke();

    // left vertical line
    ctx.beginPath();
    ctx.moveTo(s.start.x, s.end.y);
    ctx.lineTo(s.start.x, s.start.y);
    ctx.stroke();

    // clear out inner area to leave a two-color dashed outline
    ctx.clearRect(
      s.start.x + LINE_WIDTH / 2,
      s.start.y + LINE_WIDTH / 2,
      width * zoom - LINE_WIDTH,
      height * zoom - LINE_WIDTH
    );
  }

  drawLastSelection() {
    this.drawSelection(this.props.selection.start, this.props.selection.end);
  }
}

StageboxSelectionCanvas.propTypes = {
  clear: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  selection: PropTypes.shape({
    start: PropTypes.object,
    end: PropTypes.object,
  }),
  tool: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
};

export default CanvasDecorator(StageboxSelectionCanvas);
