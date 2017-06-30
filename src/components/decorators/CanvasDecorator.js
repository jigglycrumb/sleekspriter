import React from "react";
import ReactDOM from "react-dom";

function CanvasDecorator(DecoratedComponent) {
  return class CanvasDecorated extends React.Component {
    render() {
      const extraProps = {
        clear: ::this.clear,
        fitToSize: ::this.fitToSize,
      };

      return <DecoratedComponent ref="decoratoredCanvas" {...this.props} {...extraProps} />;
    }

    clear() {
      const canvas = ReactDOM.findDOMNode(this);
      canvas.width = canvas.width;
    }

    fitToSize(size, noMargin) {
      if(undefined == this.props.size) {
        console.warn("Trying to call CanvasDecorator.fitToSize, but missing prop 'size'");
      }

      let
        w = this.props.size.width,
        h = this.props.size.height,
        style = {},
        scale;

      if(w > h) scale = size/w;
      else scale = size/h;

      if(scale > 1) scale = Math.floor(scale);

      w = Math.round(w*scale);
      h = Math.round(h*scale);

      if(!noMargin) {
        style.marginTop = Math.round((size - h)/2 || 0);
        style.marginLeft = Math.round((size - w)/2 || 0);
      }

      return {
        size: {
          width: w,
          height: h,
        },
        style: style
      };
    }
  };
}

export default CanvasDecorator;
