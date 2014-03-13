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
    this.props.signal.layerContentChanged.add(this.prepareRefresh);
    this.props.signal.zoomChanged.add(this.prepareRefresh);
  },
  getInitialState: function() {
    return {
      needsRefresh: false
    };
  },
  dispatchLayerSelected: function(event) {
    //console.log('selecting layer', this.props.layer);
    this.props.signal.layerSelected.dispatch(this.props.layer);
  },
  prepareRefresh: function() {
    this.setState({needsRefresh: true});
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      //console.log('updating preview', this.props.layer);
      var sourceCanvas = document.getElementById('StageBoxLayer-'+this.props.layer);
      this.getDOMNode().width = this.getDOMNode().width;
      this.getDOMNode().getContext('2d').drawImage(sourceCanvas, 0, 0);
      this.setState({needsRefresh: false});
    }
  }
});