var LayerCanvasMixin = {
  propTypes: {
     id: React.PropTypes.number.isRequired,  // layer id
     width: React.PropTypes.number.isRequired, // file width
     height: React.PropTypes.number.isRequired, // file height
  },
  getInitialState: function() {
    return {
      needsRefresh: false,
      data: null,
      topic: null,
      subscriptions: {
        'stage.zoom.select': this.checkRefresh,
        'canvas.refresh': this.checkRefresh,
        'canvas.preview': this.checkRefresh,
        'pixel.add': this.checkRefresh,
        'pixel.delete': this.checkRefresh,
      },
    };
  },
  checkRefresh: function(data, envelope) {
    if(this.isMounted()) {
      var isStageLayer = this.getDOMNode().classList.contains('Layer');
      if(this.props.id == data.layer || (envelope.topic == 'stage.zoom.select' && isStageLayer === true)) {
        this.setState({needsRefresh: true, data: data, topic: envelope.topic});
      }
    }
  },
  componentDidMount: function() {
    this.paintLayer();
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      var layer = this.state.data.id,
          x = this.state.data.x,
          y = this.state.data.y,
          canvas = this.getDOMNode();

      switch(this.state.topic) {
        case 'pixel.add':
          var color = this.state.data.color;
          Pixel.paint(canvas, x, y, color);
          break;

        case 'pixel.delete':
          Pixel.clear(canvas, x, y);
          break;

        case 'stage.zoom.select':
        case 'canvas.refresh':
          this.paintLayer();
          break;

        case 'canvas.preview':
          this.previewLayer();
          break;
      }

      this.resetState();
    }
  },
  paintLayer: function() {
    if(this.isMounted()) {
      var canvas = this.getDOMNode();

      // clear canvas
      canvas.width = canvas.width;

      // paint
      editor.pixels.frame.forEach(function(px) {
        if(px.layer === this.props.id) {
          Pixel.paint(canvas, px.x, px.y, px.toHex());
        }
      }, this);
    }
  },
  previewLayer: function() {
    if(this.isMounted()) {
      var canvas = this.getDOMNode();

      // clear canvas
      canvas.width = canvas.width;

      // paint
      this.state.data.pixels.forEach(function(px) {
        if(px.layer === this.props.id) {
          Pixel.paint(canvas, px.x, px.y, px.toHex());
        }
      }, this);
    }
  },
};