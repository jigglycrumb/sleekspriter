var LayerBoxLayerPreview = React.createClass({
  propTypes: {
     layer: React.PropTypes.number.isRequired // layer id
  },
  render: function() {

    var style = fitCanvasIntoSquareContainer(this.props.size.width, this.props.size.height, 30);

    return (
      <canvas width={style.width} height={style.height} style={style} onClick={this.dispatchLayerSelected}></canvas>
    );
  },
  componentDidMount: function() {
    this.props.signal.boxFolded.add(this.prepareRefresh);
    this.props.signal.frameSelected.add(this.prepareRefresh);
    this.props.signal.layerContentChanged.add(this.prepareRefresh);
  },
  componentWillUnmount: function() {
    this.props.signal.boxFolded.remove(this.prepareRefresh);
    this.props.signal.frameSelected.remove(this.prepareRefresh);
    this.props.signal.layerContentChanged.remove(this.prepareRefresh);
  },
  getInitialState: function() {
    return {
      needsRefresh: false
    };
  },
  dispatchLayerSelected: function(event) {
    this.props.signal.layerSelected.dispatch(this.props.layer);
  },
  prepareRefresh: function() {
    this.setState({needsRefresh: true});
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      var w = this.getDOMNode().clientWidth,
          h = this.getDOMNode().clientHeight,
          sourceCanvas = document.getElementById('StageBoxLayer-'+this.props.layer);

      this.getDOMNode().width = this.getDOMNode().width; // clear canvas
      this.getDOMNode().getContext('2d').drawImage(sourceCanvas, 0, 0, w, h);
      this.setState({needsRefresh: false});
    }
  }
});