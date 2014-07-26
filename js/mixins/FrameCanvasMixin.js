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
        'stage.pixel.fill': this.checkRefresh,
        'stage.pixel.clear': this.checkRefresh,
        'app.frame.select': this.checkRefresh,
        'canvas.update': this.checkRefresh,
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
        case 'stage.pixel.fill':
          var pixelsAbove = this.getPixelsAbove(x, y, z);
          if(pixelsAbove === false) Pixel.paint(canvas, x, y, this.state.data.color);
          break;

        case 'stage.pixel.clear':
          var pixelsAbove = this.getPixelsAbove(x, y, z);
          if(pixelsAbove === false) {
            var pixelBelow = this.getPixelBelow(x, y, z);
            if(pixelBelow === false) Pixel.clear(canvas, x, y);
            else Pixel.paint(canvas, x, y, pixelBelow.toHex());
          }
          break;

        case 'app.frame.select':
          this.paintFrame();
          break;
      }

      this.resetState();
    }
  },
  getPixelsAbove: function(x, y, z) {
    var above = editor.pixels.frame.filter(function(px) {
      return px.frame == this.props.id && px.x == x && px.y == y && px.z > z;
    }, this);

    if(above.length == 0) return false;
    return above;
  },
  getPixelBelow: function(x, y, z) {
    var below = editor.pixels.frame.filter(function(px) {
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

    canvas.width = canvas.width;

    pixels.forEach(function(px) {
      if(px.frame === this.props.id) {
        var pixelsAbove = this.getPixelsAbove(px.x, px.y, px.z);
        if(pixelsAbove === false) Pixel.paint(canvas, px.x, px.y, px.toHex());
      }
    }, this);
  },
};