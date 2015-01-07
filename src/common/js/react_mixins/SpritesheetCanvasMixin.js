var SpritesheetCanvasMixin = {
  propTypes: {
     width: React.PropTypes.number.isRequired, // file width
     height: React.PropTypes.number.isRequired, // file height
     zoom:  React.PropTypes.number.isRequired, // zoom
  },

  getInitialState: function() {
    return {
      subscriptions: {
        'scope.set': this.checkRefresh,
        'canvas.refresh': this.checkRefresh,
        // 'canvas.preview': this.checkRefresh,
        'app.layer.delete': this.checkRefresh,
      },
    };
  },
  checkRefresh: function(data, envelope) {
    switch(envelope.topic) {
      case 'scope.set':
      case 'canvas.refresh':
      case 'app.layer.delete':
        this.paintSpritesheet();
        break;

      // case 'canvas.preview':
      //   this.previewSpritesheet(data.pixels);
      //   break;
    }
  },
  componentDidMount: function() {
    this.paintSpritesheet();
  },
  componentDidUpdate: function() {
    this.paintSpritesheet();
  },
  getPixelsAbove: function(pixels, x, y, z, frame) {
    var frame = frame || this.props.id,
        above = pixels.filter(function(px) {
          return px.frame == frame && px.x == x && px.y == y && px.z > z;
        }, this);

    if(above.length == 0) return false;
    return above;
  },
  getPixelBelow: function(pixels, x, y, z, frame) {
    var frame = frame || this.props.id,
        below = pixels.filter(function(px) {
          return px.frame == frame && px.x == x && px.y == y && px.z < z;
        }, this);

    if(below.length == 0) return false;

    return _.max(below, function(px) {
      return px.z;
    });
  },
  paintSpritesheet: function() {

    var canvas = this.getDOMNode(),
        pixels = editor.pixels.file;

    // clear canvas
    canvas.width = canvas.width;

    if(this.props.backgroundColor && this.props.backgroundColor !== 'transparent') {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = this.props.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // paint
    pixels.forEach(function(px) {
      var targetPos = this.getPixelSpritesheetPosition(px),
          pixelsAbove = this.getPixelsAbove(pixels, px.x, px.y, px.z, px.frame);
      if(pixelsAbove === false) Pixel.paint(canvas, targetPos.x, targetPos.y, px.toHex(), this.props.zoom);
    }, this);
  },
  getPixelSpritesheetPosition: function(pixel) {
    var framePos = {
      x: (x = pixel.frame % this.props.frames.x) === 0 ? this.props.frames.x : x,
      y: Math.ceil(pixel.frame / this.props.frames.x),
    };

    var targetPos = {
      x: ((framePos.x-1) * this.props.width) + pixel.x,
      y: ((framePos.y-1) * this.props.height) + pixel.y,
    };
    return targetPos;
  },
  // previewSpritesheet: function(pixels) {
  //   var canvas = this.getDOMNode();

  //   editor.pixels.frame.forEach(function(px) {
  //     if(px.layer !== this.state.data.layer) pixels.push(px);
  //   }, this);

  //   // clear canvas
  //   canvas.width = canvas.width;

  //   // paint
  //   pixels.forEach(function(px) {
  //     var pixelsAbove = this.getPixelsAbove(pixels, px.x, px.y, px.z);
  //     if(pixelsAbove === false) Pixel.paint(canvas, px.x, px.y, px.toHex());
  //   }, this);
  // },
};