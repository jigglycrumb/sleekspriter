var OffscreenFrameCanvas = React.createClass({
  propTypes: {
    frame: React.PropTypes.number.isRequired
  },
  getInitialState: function() {
    return {
      needsRefresh: false
    };
  },
  render: function() {
    return (
      <canvas
        id={this.props.key}
        className="OffscreenFrameCanvas"
        width={this.props.file.size.width}
        height={this.props.file.size.height}
        style={{
          width: this.props.file.size.width,
          height: this.props.file.size.height
        }}
      ></canvas>
    );
  },
  componentDidMount: function() {

    this.props.signal.frameSelected.add(this.prepareRefresh);

    this.props.signal.layerContentChanged.add(this.prepareRefresh);
    this.props.signal.layerVisibilityChanged.add(this.prepareRefresh);
    this.props.signal.layerOpacityChanged.add(this.prepareRefresh);

    this.props.signal.pixelSelected.add(this.getPixelColor);
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh && (this.props.frame == this.props.editor.frame)) {
      this.getDOMNode().width = this.getDOMNode().width;
      var self = this;
      for(var i = this.props.file.layers.length -1; i >= 0; i--) {
        var layer = this.props.file.layers[i];
        if(layer.visible) {
          var sourceCanvas = document.getElementById('StageBoxLayer-'+layer.id);
          var ctx = self.getDOMNode().getContext('2d');
          ctx.globalAlpha = layer.opacity/100;
          ctx.drawImage(sourceCanvas, 0, 0, this.props.file.size.width, this.props.file.size.height);
        }
      }
      this.props.signal.frameContentChanged.dispatch(this.props.frame);
    }
  },
  prepareRefresh: function() {
    if(this.props.frame == this.props.editor.frame) {
      this.setState({needsRefresh: true});
    }
  },
  getPixelColor: function(x, y) {
    if(this.props.frame == this.props.editor.frame) {
      var ctx = this.getDOMNode().getContext('2d'),
          px = ctx.getImageData(x, y, 1, 1).data,
          color = Color({r:px[0], g:px[1], b:px[2], a:px[3]});

      editor.pixelColor = color;
    }
  }
});