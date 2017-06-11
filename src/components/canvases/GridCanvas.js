import React from "react";
import PropTypes from "prop-types";

class GridCanvas extends React.Component {
  render() {
    const css = {
      width: this.props.width,
      height: this.props.height,
    };

    return (
      <canvas ref="canvas" className="GridCanvas" style={css} width={this.props.width} height={this.props.height}></canvas>
    );
  }

  componentDidMount() {
    this.drawGrid();
  }

  componentDidUpdate() {
    this.clear();
    this.drawGrid();
  }

  drawGrid() {
    const
      canvas = this.refs.canvas,
      ctx = canvas.getContext("2d"),
      cell = {
        width: this.props.width / this.props.columns,
        height: this.props.height / this.props.rows
      };

    if(cell.width >= 2 && cell.height >= 2) {
      ctx.strokeStyle = "#828282";
      ctx.beginPath();

      if(this.props.columns > 1) {
        // vertical lines
        for(let x = cell.width + 0.5; x < this.props.width; x+= cell.width) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
        }
      }

      if(this.props.rows > 1) {
        // horizontal lines
        for(let y = cell.height + 0.5; y < this.props.height; y+= cell.height) {
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
        }
      }

      ctx.stroke();
    }
  }

  clear() {
    const canvas = this.refs.canvas;
    canvas.width = canvas.width;
  }
}

GridCanvas.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
};

export default GridCanvas;
