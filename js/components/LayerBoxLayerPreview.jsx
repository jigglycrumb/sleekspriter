/** @jsx React.DOM */
var LayerBoxLayerPreview = React.createClass({
  propTypes: {
     id: React.PropTypes.number.isRequired,  // layer id
     width: React.PropTypes.number.isRequired, // file width
     height: React.PropTypes.number.isRequired, // file height
  },
  mixins:[ResetStateMixin, PostalSubscriptionMixin, LayerCanvasMixin],
  render: function() {
    var style = fitCanvasIntoSquareContainer(this.props.width, this.props.height, 30);
    return (
      <canvas width={style.width} height={style.height} style={style}></canvas>
    );
  }
});