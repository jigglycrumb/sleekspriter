// obsolete
var PreviewBoxPreview = React.createClass({
  mixins: [FluxMixin, FrameCanvasMixin],
  render: function() {
    var scale = this.getScale(),
        width = this.props.width*scale,
        height = this.props.height*scale;

    return (
      <canvas id="PreviewBoxPreview" width={width} height={height}></canvas>
    );
  },
  componentDidUpdate: function() {
    // this.getPixelColor(this.props.ui.cursor);
  },
  getPixelColor: function(position) {
    var scale = this.getScale(),
        ctx   = this.getDOMNode().getContext('2d'),
        x     = position.x-1,
        y     = position.y-1,
        px    = ctx.getImageData(x*scale, y*scale, 1, 1).data,
        color = new Color({r:px[0], g:px[1], b:px[2], a:px[3]});

    //this.getFlux().actions.colorFrame(color.hexString());
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