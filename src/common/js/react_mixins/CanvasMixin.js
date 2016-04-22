var CanvasMixin = {

  componentDidMount: function() {
    this.paint();
  },

  componentDidUpdate: function() {
    this.paint();
  },

  fitToSize: function(size, noMargin) {

    var w = this.props.file.size.width,
        h = this.props.file.size.height,
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
    }
  },

  clear: function() {
    var canvas = ReactDOM.findDOMNode(this);
    canvas.width = canvas.width;
  },
};
