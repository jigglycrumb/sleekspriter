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
      },
    };
  },
  checkRefresh: function(data, envelope) {
    if(this.props.id === data.frame || this.props.alwaysRefresh === true) {
      this.setState({needsRefresh: true, data: data, topic: envelope.topic});
    }
  },
  componentDidMount: function() {
    this.paintFrame(this.props.id);
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      var frame = this.state.data.frame,
          x = this.state.data.x,
          y = this.state.data.y,
          z = this.state.data.z,
          canvas = this.getDOMNode();

      switch(this.state.topic) {
        case 'stage.pixel.fill':
          var pixelsAbove = this.getPixelsAbove(x, y, z);
          if(pixelsAbove.length === 0) Pixel.paint(canvas, x, y, this.state.data.color);
          break;

        case 'stage.pixel.clear':
          var pixelsAbove = this.getPixelsAbove(x, y, z);
          if(pixelsAbove.length === 0) {
            var pixelBelow = this.getPixelBelow(x, y, z);
            if(pixelBelow === false) Pixel.clear(canvas, x, y);
            else Pixel.paint(canvas, x, y, pixelBelow.toHex());
          }
          break;

        case 'app.frame.select':
          this.paintFrame(frame);
          break;
      }

      this.resetState();
    }
  },
  getPixelsAbove: function(x, y, z) {
    return _.filter(editor.pixels.frame, function(px) {
      return px.x == x && px.y == y && px.z > z;
    });
  },
  getPixelBelow: function(x, y, z) {
    var below = _.filter(editor.pixels.frame, function(px) {
      return px.x == x && px.y == y && px.z < z;
    });

    if(below.length == 0) return false;

    return _.max(below, function(px) {
      return px.z;
    });
  },
  paintFrame: function(frame) {
    var canvas = this.getDOMNode();
    canvas.width = canvas.width;

    file.pixels.forEach(function(px) {
      if(px.frame === frame) {
        var pixelsAbove = this.getPixelsAbove(px.x, px.y, px.z);
        if(pixelsAbove.length === 0) Pixel.paint(canvas, px.x, px.y, px.toHex());
      }
    }, this);
  },
};