var CompositeCanvasMixin = {
  propTypes: {
    frame: React.PropTypes.number.isRequired
  },
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
      for(var i = this.props.io.layers.length -1; i >= 0; i--) {
        var layer = this.props.io.layers[i];
        var sourceCanvas = document.getElementById('StageBoxLayer-'+layer.id);
        var ctx = self.getDOMNode().getContext('2d');
        ctx.globalAlpha = layer.opacity/100;
        ctx.drawImage(sourceCanvas, 0, 0);
      }
      this.props.signal.frameContentChanged.dispatch(this.props.frame);
    }
  },
  prepareRefresh: function() {
    if(this.props.frame == this.props.editor.frame) {
      this.setState({needsRefresh: true});
    }
  }
};