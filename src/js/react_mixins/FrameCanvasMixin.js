var FrameCanvasMixin = {
  propTypes: {
     id: React.PropTypes.number.isRequired,  // frame id
     width: React.PropTypes.number.isRequired, // file width
     height: React.PropTypes.number.isRequired, // file height
     alwaysRefresh: React.PropTypes.bool,
  },

  getInitialState: function() {
    return {
      needsRefresh: false,
      data: null,
      topic: null,
      subscriptions: {
        'app.frame.select': this.checkRefresh,
        'canvas.refresh': this.checkRefresh,
        'canvas.preview': this.checkRefresh,
        'pixel.add': this.checkRefresh,
        'pixel.delete': this.checkRefresh,
      },
    };
  },
  checkRefresh: function(data, envelope) {
    if(this.props.id === data.frame || this.props.alwaysRefresh === true) {
      this.setState({needsRefresh: true, data: data, topic: envelope.topic});
    }
  },
  componentDidMount: function() {
    this.paintFrame();
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      var x = this.state.data.x,
          y = this.state.data.y,
          z = this.state.data.z,
          canvas = this.getDOMNode();

      switch(this.state.topic) {
        case 'pixel.add':
          var pixelsAbove = this.getPixelsAbove(editor.pixels.frame, x, y, z);
          if(pixelsAbove === false) Pixel.paint(canvas, x, y, this.state.data.color);
          break;

        case 'pixel.delete':
          var pixelsAbove = this.getPixelsAbove(editor.pixels.frame, x, y, z);
          if(pixelsAbove === false) {
            var pixelBelow = this.getPixelBelow(editor.pixels.frame, x, y, z);
            if(pixelBelow === false) Pixel.clear(canvas, x, y);
            else Pixel.paint(canvas, x, y, pixelBelow.toHex());
          }
          break;

        case 'app.frame.select':
        case 'canvas.refresh':
          this.paintFrame();
          break;

        case 'canvas.preview':
          this.previewFrame();
          break;
      }

      this.resetState();
    }
  },
  getPixelsAbove: function(pixels, x, y, z) {
    var above = pixels.filter(function(px) {
      return px.frame == this.props.id && px.x == x && px.y == y && px.z > z;
    }, this);

    if(above.length == 0) return false;
    return above;
  },
  getPixelBelow: function(pixels, x, y, z) {
    var below = pixels.filter(function(px) {
      return px.frame == this.props.id && px.x == x && px.y == y && px.z < z;
    }, this);

    if(below.length == 0) return false;

    return _.max(below, function(px) {
      return px.z;
    });
  },
  paintFrame: function() {
    var canvas = this.getDOMNode(),
        pixels = editor.frame.selected == this.props.id ? editor.pixels.frame : editor.pixels.file;

    // clear canvas
    canvas.width = canvas.width;

    pixels.forEach(function(px) {
      if(px.frame === this.props.id) {
        var pixelsAbove = this.getPixelsAbove(editor.pixels.frame, px.x, px.y, px.z);
        if(pixelsAbove === false) Pixel.paint(canvas, px.x, px.y, px.toHex());
      }
    }, this);
  },
  previewFrame: function() {
    var canvas = this.getDOMNode(),
        pixels = this.state.data.pixels;

    editor.pixels.frame.forEach(function(px) {
      if(px.layer !== this.state.data.layer) pixels.push(px);
    }, this);

    // clear canvas
    canvas.width = canvas.width;

    pixels.forEach(function(px) {
      var pixelsAbove = this.getPixelsAbove(pixels, px.x, px.y, px.z);
      if(pixelsAbove === false) Pixel.paint(canvas, px.x, px.y, px.toHex());
    }, this);
  },
};