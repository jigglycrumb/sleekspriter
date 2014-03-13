var LayerBoxLayerPreview = React.createClass({
  propTypes: {
     layer: React.PropTypes.number.isRequired // layer id
  },
  render: function() {
    return (
      <canvas className="preview" width={this.props.size.width*this.props.zoom} height={this.props.size.height*this.props.zoom} onClick={this.dispatchLayerSelected}></canvas>
    );
  },
  componentDidMount: function() {
    this.props.signal.layerContentChanged.add(this.onLayerContentChanged);
  },
  dispatchLayerSelected: function(event) {
    this.props.signal.layerSelected.dispatch(this.props.layer);
  },
  onLayerContentChanged: function(layer) {
    if(layer == this.props.layer) {
      var sourceCanvas = document.getElementById('StageBoxLayer-'+this.props.layer);
      this.getDOMNode().width = this.getDOMNode().width;
      this.getDOMNode().getContext('2d').drawImage(sourceCanvas, 0, 0);
    }
  }
});