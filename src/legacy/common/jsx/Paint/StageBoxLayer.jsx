var StageBoxLayer = React.createClass({
  render: function() {
    var htmlId  = 'StageBoxLayer-'+this.props.id,
        display = (this.props.layer.visible === true) ? 'block' : 'none',
        style = {
          zIndex: this.props.layer.z,
          opacity: this.props.layer.opacity/100,
          display: display,
        };

    return (
      <div id={htmlId} className="Layer" style={style}>
        <LayerCanvas layer={this.props.layer.id} zoom={this.props.ui.zoom.selected} file={this.props.file} pixels={this.props.pixels} ref="layerCanvas" />
      </div>
    );
  },
});
