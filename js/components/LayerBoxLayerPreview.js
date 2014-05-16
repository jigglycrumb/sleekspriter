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
    this.subscriptions = [
      channel.subscribe('app.frame.select', this.prepareRefresh),
      channel.subscribe('app.box.toggle', this.prepareRefresh),
      channel.subscribe('stage.layer.update', this.prepareRefresh),
    ];
  },
  componentWillUnmount: function() {
    this.subscriptions.forEach(function(subscription) {
      subscription.unsubscribe();
    });
  },
  getInitialState: function() {
    return {
      needsRefresh: false
    };
  },
  dispatchLayerSelected: function() {
    channel.publish('app.layer.select', {layer: this.props.layer});
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