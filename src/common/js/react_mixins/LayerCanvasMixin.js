var LayerCanvasMixin = {
  propTypes: {
     id: React.PropTypes.number.isRequired,  // layer id
     width: React.PropTypes.number.isRequired, // file width
     height: React.PropTypes.number.isRequired, // file height
     stage: React.PropTypes.bool.isRequired, // flag if layer is on stage (necessary for reacting to zoom events)
  },
  getInitialState: function() {
    return {
      subscriptions: {
        'zoom.select': this.checkRefresh,
        'canvas.refresh': this.checkRefresh,
        'canvas.preview': this.checkRefresh,
        'pixel.add': this.checkRefresh,
        'pixel.delete': this.checkRefresh,
        'scope.set': this.checkRefresh,
        'size.set': this.checkRefresh,
      },
    };
  },
  checkRefresh: function(data, envelope) {
    if(this.isMounted()) {
      if(this.props.id === data.layer
      || envelope.topic === 'scope.set'
      || envelope.topic === 'size.set'
      || (this.props.stage === true && envelope.topic === 'zoom.select')) {
        switch(envelope.topic) {
          case 'pixel.add':
            Pixel.paint(this.getDOMNode(), data.x, data.y, data.color);
            break;

          case 'pixel.delete':
            Pixel.clear(this.getDOMNode(), data.x, data.y);
            break;

          case 'canvas.refresh':
          case 'scope.set':
            this.paintLayer();
            break;

          case 'size.set':
          case 'zoom.select':
            setTimeout(this.paintLayer, 100); // TODO: implement a proper fix for this
                                              // the timeout is evil
                                              // problem: the stage canvas resizes after
                                              // the pixels are painted, so it's blank
                                              // when the user zooms
            break;

          case 'canvas.preview':
            this.previewLayer(data.pixels);
            break;
        }
      }
    }
  },
  componentDidMount: function() {
    this.paintLayer();
  },
  paintLayer: function() {
    var canvas = this.getDOMNode(),
        paint = function(px) {
          if(px.layer === this.props.id) {
            Pixel.paint(canvas, px.x, px.y, px.toHex());
          }
        };

    // clear canvas
    canvas.width = canvas.width;

    // paint
    editor.pixels.scope.forEach(paint, this);
    editor.pixels.frame.forEach(paint, this);
  },
  previewLayer: function(pixels) {
    var canvas = this.getDOMNode();

    // clear canvas
    canvas.width = canvas.width;

    // paint
    pixels.forEach(function(px) {
      if(px.layer === this.props.id) {
        Pixel.paint(canvas, px.x, px.y, px.toHex());
      }
    }, this);
  },
};