var FrameCanvas = React.createClass({
  mixins: [PostalSubscriptionMixin, FrameCanvasMixin],
  render: function() {
    var fit = fitCanvasIntoSquareContainer(this.props.width, this.props.height, this.props.size);
    return (
      <canvas width={fit.width} height={fit.height} style={fit.style}/>
    );
  }
});