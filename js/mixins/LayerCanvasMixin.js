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
      },
    };
  },
  checkRefresh: function(data, envelope) {
    if(this.props.id == data.layer) {
      this.setState({needsRefresh: true, data: data, topic: envelope.topic});
    }
  },
  componentDidUpdate: function() {

    if(this.state.needsRefresh) {

      var x = this.state.data.x,
          y = this.state.data.y,
          canvas = this.getDOMNode();

      switch(this.state.topic) {
        case 'stage.pixel.fill':
          var color = this.state.data.color;
          Pixel.fill(canvas, x, y, color);
          break;
        case 'stage.pixel.clear':
          Pixel.clear(canvas, x, y);
          break;
      }

      this.resetState();
    }
  },
};