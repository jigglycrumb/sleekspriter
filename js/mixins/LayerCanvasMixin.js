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
        'stage.pixel.fill': this.checkRefresh,
        'stage.pixel.clear': this.checkRefresh,
        'stage.zoom.select': this.checkRefresh,
      },
    };
  },
  checkRefresh: function(data, envelope) {
    var isStageLayer = this.getDOMNode().classList.contains('Layer');
    if(this.props.id == data.layer || (envelope.topic == 'stage.zoom.select' && isStageLayer === true)) {
      this.setState({needsRefresh: true, data: data, topic: envelope.topic});
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
        case 'stage.pixel.fill':
          var color = this.state.data.color;
          Pixel.paint(canvas, x, y, color);
          break;

        case 'stage.pixel.clear':
          Pixel.clear(canvas, x, y);
          break;

        case 'stage.zoom.select':
          this.paintLayer();
          break;
      }

      this.resetState();
    }
  },
  paintLayer: function() {
    if(this.isMounted()) {
      var canvas = this.getDOMNode(),
          layer = this.props.id;
      canvas.width = canvas.width;

      file.pixels.forEach(function(px) {
        if(px.layer === layer) {
          Pixel.paint(canvas, px.x, px.y, px.toHex());
        }
      }, this);
    }
  },
};