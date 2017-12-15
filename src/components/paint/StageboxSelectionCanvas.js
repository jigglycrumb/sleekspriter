import React from "react";
import { CanvasDecorator } from "../decorators";
import { selectionIsActive } from "../../utils";

class StageboxSelectionCanvas extends React.Component {
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
    this.interval = setInterval(::this.tick, 200);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.props.clear();

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
  }

  drawSelection(start, end) {
    this.props.clear();

    const canvas = this.canvas,
      zoom = this.props.zoom,
      ctx = canvas.getContext("2d"),
      pattern = ctx.createPattern(
        document.getElementById("SelectionPattern"),
        "repeat"
      );

    let width = end.x - start.x,
      height = end.y - start.y,
      sx,
      sy;

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

    ctx.strokeStyle = pattern;
    ctx.strokeRect(
      sx * zoom + 0.5,
      sy * zoom + 0.5,
      width * zoom - 1,
      height * zoom - 1
    );
  }

  drawLastSelection() {
    this.drawSelection(this.props.selection.start, this.props.selection.end);
  }
}

export default CanvasDecorator(StageboxSelectionCanvas);
