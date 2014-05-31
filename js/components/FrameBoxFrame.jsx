/** @jsx React.DOM */
var FrameBoxFrame = React.createClass({
  mixins: [ResetStateMixin, PostalSubscriptionMixin, FrameCanvasMixin],
  render: function() {
    var style = fitCanvasIntoSquareContainer(this.props.width, this.props.height, this.props.size);
    return (
      <canvas
        width={style.width}
        height={style.height}
        style={style} />
    );
  }
});