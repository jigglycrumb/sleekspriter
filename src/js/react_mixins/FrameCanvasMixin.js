var FrameCanvasMixin = {
  propTypes: {
     id: React.PropTypes.number.isRequired,  // frame id
     width: React.PropTypes.number.isRequired, // file width
     height: React.PropTypes.number.isRequired, // file height
     alwaysRefresh: React.PropTypes.bool, // required for preview box to always render the current frame
  },

  getInitialState: function() {
    return {
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
      switch(envelope.topic) {
        case 'pixel.add':
          var pixelsAbove = this.getPixelsAbove(editor.pixels.frame, data.x, data.y, data.z);
          if(pixelsAbove === false) Pixel.paint(this.getDOMNode(), data.x, data.y, data.color);
          break;

        case 'pixel.delete':
          var pixelsAbove = this.getPixelsAbove(editor.pixels.frame, data.x, data.y, data.z);
          if(pixelsAbove === false) {
            var pixelBelow = this.getPixelBelow(editor.pixels.frame, data.x, data.y, data.z);
            if(pixelBelow === false) Pixel.clear(this.getDOMNode(), data.x, data.y);
            else Pixel.paint(this.getDOMNode(), data.x, data.y, pixelBelow.toHex());
          }
          break;

        case 'app.frame.select':
        case 'canvas.refresh':
          this.paintFrame();
          break;

        case 'canvas.preview':
          this.previewFrame(data.pixels);
          break;
      }
    }
  },
  componentDidMount: function() {
    this.paintFrame();
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
        paint = function(px) {
          var pixelsAbove = this.getPixelsAbove(editor.pixels.frame, px.x, px.y, px.z);
          if(pixelsAbove === false) Pixel.paint(canvas, px.x, px.y, px.toHex());
        };

    // clear canvas
    canvas.width = canvas.width;

    // paint
    if(editor.frame.selected === this.props.id) {
      editor.pixels.frame.forEach(paint, this);
      editor.pixels.scope.forEach(paint, this);
    }
    else {
      editor.pixels.file.forEach(function(px) {
        if(px.frame === this.props.id) paint.call(this, px);
      }, this);
    }
  },
  previewFrame: function(pixels) {
    var canvas = this.getDOMNode();

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