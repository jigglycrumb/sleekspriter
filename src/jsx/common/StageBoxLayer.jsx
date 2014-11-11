/** @jsx React.DOM */
var StageBoxLayer = React.createClass({
  mixins:[PostalSubscriptionMixin, LayerCanvasMixin],
  render: function() {
    var display = (this.props.layer.visible === true) ? 'block' : 'none';
    return (
      <canvas
        id={this.props.key}
        className="Layer"
        width={this.props.width}
        height={this.props.height}
        style={{
          zIndex: this.props.layer.z,
          opacity: this.props.layer.opacity/100,
          display: display,
        }}>
      </canvas>
    );
  },
});