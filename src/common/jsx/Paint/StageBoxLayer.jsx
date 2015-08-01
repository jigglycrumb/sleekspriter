// Flux: done, editor: done
var StageBoxLayer = React.createClass({
  mixins:[LayerCanvasMixin],
  render: function() {
    var htmlId  = 'StageBoxLayer-'+this.props.id,
        display = (this.props.layer.visible === true) ? 'block' : 'none';
    return (
      <canvas
        id={htmlId}
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