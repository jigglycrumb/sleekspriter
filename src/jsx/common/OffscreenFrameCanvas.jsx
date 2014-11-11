/** @jsx React.DOM */
var OffscreenFrameCanvas = React.createClass({
  mixins: [PostalSubscriptionMixin, FrameCanvasMixin],
  render: function() {
    return (
      <canvas
        id={this.props.key}
        className="OffscreenFrameCanvas"
        width={this.props.width}
        height={this.props.height}
      ></canvas>
    );
  },
  componentDidMount: function() {
    this.subscriptions.push(channel.subscribe('app.cursor.set', this.getPixelColor));
  },
  getPixelColor: function(data) {
    if(this.props.id == this.props.selectedframe) {
      var ctx = this.getDOMNode().getContext('2d'),
          px = ctx.getImageData(data.position.x-1, data.position.y-1, 1, 1).data,
          color = new Color({r:px[0], g:px[1], b:px[2], a:px[3]});

      editor.color.frame = color;
    }
  }
});