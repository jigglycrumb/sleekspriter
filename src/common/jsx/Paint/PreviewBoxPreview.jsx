var PreviewBoxPreview = React.createClass({
  mixins: [PostalSubscriptionMixin, FrameCanvasMixin],
  render: function() {
    var scale = this.getScale(),
        width = this.props.width*scale,
        height = this.props.height*scale;

    return (
      <canvas id="PreviewBoxPreview" width={width} height={height}></canvas>
    );
  },
  componentDidMount: function() {
    this.subscriptions.push(channel.gui.subscribe('cursor.set', this.getPixelColor));
  },
  getPixelColor: function(data) {
    var scale = this.getScale(),
        ctx   = this.getDOMNode().getContext('2d'),
        x     = data.position.x-1,
        y     = data.position.y-1,
        px    = ctx.getImageData(x*scale, y*scale, 1, 1).data,
        color = new Color({r:px[0], g:px[1], b:px[2], a:px[3]});

    editor.color.frame = color;
  },
  getScale: function() {
    var scale = 1,
        maxWidth = 160,
        maxHeight = 90;

    if(this.props.width > this.props.height) {
      // scale to width
      scale = maxWidth/this.props.width;
    }
    else {
      // scale to height
      scale = maxHeight/this.props.height;
    }

    return Math.floor(scale);
  },
});