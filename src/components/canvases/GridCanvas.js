import React from "react";
import PropTypes from "prop-types";
import { CanvasDecorator } from "../decorators";

class GridCanvas extends React.Component {
  render() {
    const css = {
      width: this.props.width,
      height: this.props.height,
    };

    return (
      <canvas
        ref={n => (this.canvas = n)}
        className="GridCanvas"
        style={css}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }

  componentDidMount() {
    this.drawGrid();
  }

  componentDidUpdate() {
    this.props.clear();
    this.drawGrid();
  }

  drawGrid() {
    const canvas = this.canvas;
    const ctx = canvas.getContext("2d");
    const cell = {
      width: this.props.width / this.props.columns,
      height: this.props.height / this.props.rows,
    };

    if (cell.width >= 2 && cell.height >= 2) {
      ctx.strokeStyle = "#828282";
      ctx.beginPath();

      if (this.props.columns > 1) {
        // vertical lines
        for (let x = cell.width + 0.5; x < this.props.width; x += cell.width) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
        }
      }

      if (this.props.rows > 1) {
        // horizontal lines
        for (
          let y = cell.height + 0.5;
          y < this.props.height;
          y += cell.height
        ) {
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
        }
      }

      ctx.stroke();
    }
  }
}

GridCanvas.propTypes = {
  clear: PropTypes.func.isRequired,
  columns: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export { GridCanvas };
export default CanvasDecorator(GridCanvas);
