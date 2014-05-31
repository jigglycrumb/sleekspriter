/** @jsx React.DOM */
var LayerBoxLayerPreview = React.createClass({
  mixins:[ResetStateMixin, PostalSubscriptionMixin, LayerCanvasMixin],
  render: function() {
    var style = fitCanvasIntoSquareContainer(this.props.width, this.props.height, 30);
    return (
      <canvas width={style.width} height={style.height} style={style}></canvas>
    );
  }
});