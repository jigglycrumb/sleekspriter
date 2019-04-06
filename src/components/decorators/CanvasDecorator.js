import React from "react";
import ReactDOM from "react-dom";

import { sizeShape } from "../../shapes";

function CanvasDecorator(DecoratedComponent) {
  class CanvasDecorated extends React.Component {
    constructor(props) {
      super(props);

      this.clear = this.clear.bind(this);
      this.clearSinglePixel = this.clearSinglePixel.bind(this);
      this.fitToSize = this.fitToSize.bind(this);
      this.paintSinglePixel = this.paintSinglePixel.bind(this);
    }

    render() {
      const extraProps = {
        clear: this.clear,
        clearSinglePixel: this.clearSinglePixel,
        fitToSize: this.fitToSize,
        paintSinglePixel: this.paintSinglePixel,
      };

      return (
        <DecoratedComponent
          ref={n => (this.decoratedCanvas = n)}
          {...this.props}
          {...extraProps}
        />
      );
    }

    clear() {
      const canvas = ReactDOM.findDOMNode(this); // TODO try to replace with ref
      canvas.width = canvas.width;
    }

    fitToSize(size, noMargin) {
      if (undefined === this.props.size) {
        console.warn(
          "Trying to call CanvasDecorator.fitToSize, but missing prop 'size'"
        );
      }

      let w = this.props.size.width;
      let h = this.props.size.height;
      let style = {};
      let scale;

      if (w > h) scale = size / w;
      else scale = size / h;

      if (scale > 1) scale = Math.floor(scale);

      w = Math.round(w * scale);
      h = Math.round(h * scale);

      if (!noMargin) {
        style.marginTop = Math.round((size - h) / 2 || 0);
        style.marginLeft = Math.round((size - w) / 2 || 0);
      }

      return {
        size: {
          width: w,
          height: h,
        },
        style: style,
      };
    }

    paintSinglePixel(canvas, size, x, y, color) {
      const alpha = 1;
      const scale = canvas.width / size.width;
      const cX = (x - 1) * scale;
      const cY = (y - 1) * scale;
      const ctx = canvas.getContext("2d");
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(cX, cY, scale, scale);
    }

    clearSinglePixel(canvas, size, x, y) {
      const scale = canvas.width / size.width;
      const cX = (x - 1) * scale;
      const cY = (y - 1) * scale;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(cX, cY, scale, scale);
    }
  }

  CanvasDecorated.propTypes = {
    size: sizeShape,
  };

  return CanvasDecorated;
}

export default CanvasDecorator;
