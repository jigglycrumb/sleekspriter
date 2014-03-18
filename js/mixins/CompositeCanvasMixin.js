var CompositeCanvasMixin = {
  getInitialState: function() {
    return {
      needsRefresh: false
    };
  },
  componentDidMount: function() {
    this.props.signal.layerContentChanged.add(this.prepareRefresh);
    this.props.signal.layerVisibilityChanged.add(this.prepareRefresh);
    this.props.signal.layerOpacityChanged.add(this.prepareRefresh);
    this.props.signal.pixelFilled.add(this.prepareRefresh);
    this.props.signal.pixelCleared.add(this.prepareRefresh);
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      var self = this;
      this.getDOMNode().width = this.getDOMNode().width;
      this.props.io.layers.forEach(function(layer) {
        if(layer.visible) {
          var sourceCanvas = document.getElementById('StageBoxLayer-'+layer.id);
          var ctx = self.getDOMNode().getContext('2d');
          ctx.globalAlpha = layer.opacity/100;
          ctx.drawImage(sourceCanvas, 0, 0);
        }
      });
    }
  },
  prepareRefresh: function() {
    this.setState({needsRefresh: true});
  }
};