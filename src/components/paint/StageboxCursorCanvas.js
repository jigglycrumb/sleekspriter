import React from "react";

class StageBoxCursorCanvas extends React.Component {
  render() {
    return (
      <canvas
        ref={n => (this.canvas = n)}
        id="StageBoxCursorCanvas"
        className="Layer"
        width={this.props.width}
        height={this.props.height}
      />
    );
  }

  clear() {
    const canvas = this.canvas;
    canvas.width = canvas.width;
  }

  drawPixelCursor(x, y) {
    this.clear();

    const { zoom } = this.props;

    if (x === 0 && y === 0) return;

    const canvas = this.canvas;
    const ctx = canvas.getContext("2d");
    const left = x * zoom - zoom + 0.5;
    const top = y * zoom - zoom + 0.5;

    let right = x * zoom + 0.5;
    let bottom = y * zoom + 0.5;

    if (zoom < 3) {
      right++;
      bottom++;
    }

    ctx.strokeStyle = "#FF0000";
    ctx.lineCap = "square";
    ctx.lineWidth = 1;

    // if(zoom < 5 ) ctx.lineWidth = 1;
    // else ctx.lineWidth = 2;

    ctx.beginPath();

    if (x > 1) {
      ctx.moveTo(left, 0);
      ctx.lineTo(left, canvas.height);
    }

    if (x < canvas.width / zoom) {
      ctx.moveTo(right, 0);
      ctx.lineTo(right, canvas.height);
    }

    if (y > 1) {
      ctx.moveTo(0, top);
      ctx.lineTo(canvas.width, top);
    }

    if (y < canvas.height / zoom) {
      ctx.moveTo(0, bottom);
      ctx.lineTo(canvas.width, bottom);
    }

    ctx.stroke();
  }
}

export default StageBoxCursorCanvas;
