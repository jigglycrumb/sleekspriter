var CompositeCanvas = React.createClass({
  render: function() {
    return (
      <canvas
        id="CompositeCanvas"
        width={this.props.io.size.width*this.props.editor.zoom}
        height={this.props.io.size.height*this.props.editor.zoom}
        style={{
          width: this.props.io.size.width,
          height: this.props.io.size.height
        }}
      ></canvas>
    );
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

    this.props.signal.pixelSelected.add(this.getPixelColor);
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      //console.log('drawing CompositeCanvas');
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
  },
  getPixelColor: function(x, y) {
    var ctx = this.getDOMNode().getContext('2d'),
        px = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data,
        color = Color({r:px[0], g:px[1], b:px[2], a:px[3]});

    editor.pixelColor = color;
  }
});