var CanvasMixin = {

  componentDidMount: function() {
    this.paint();
  },

  componentDidUpdate: function() {
    this.paint();
  },

  fitToSize: function(size) {
    var w = this.props.file.size.width,
        h = this.props.file.size.height,
        style = {},
        scale;

    if(w > h) scale = Math.floor(size/w);
    else scale = Math.floor(size/h);

    style.marginTop = Math.floor((size - Math.round(h*scale))/2);
    style.marginLeft = Math.floor((size - Math.round(w*scale))/2);

    w = Math.round(w*scale);
    h = Math.round(h*scale);

    return {
      size: {
        width: w,
        height: h,
      },
      style: style
    }
  },

  clear: function() {
    var canvas = this.getDOMNode();
    canvas.width = canvas.width;
  },

  getPixelsAbove: function(pixels, x, y, z) {
    var above = pixels.filter(function(px) {
      return px.frame == this.props.frame && px.x == x && px.y == y && px.z > z;
    }, this);

    if(above.length == 0) return false;
    return above;
  },

  getPixelBelow: function(pixels, x, y, z) {
    var below = pixels.filter(function(px) {
      return px.frame == this.props.frame && px.x == x && px.y == y && px.z < z;
    }, this);

    if(below.length == 0) return false;

    return _.max(below, function(px) {
      return px.z;
    });
  },
};