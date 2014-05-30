/** @jsx React.DOM */
var LayerBoxLayerPreview = React.createClass({
  mixins:[ResetStateMixin],
  propTypes: {
     id: React.PropTypes.number.isRequired // layer id
  },
  getInitialState: function() {
    return {
      needsRefresh: false,
      data: null,
    };
  },
  render: function() {

    var style = fitCanvasIntoSquareContainer(this.props.size.width, this.props.size.height, 30);

    return (
      <canvas width={style.width} height={style.height} style={style} onClick={this.dispatchLayerSelected}></canvas>
    );
  },
  componentDidMount: function() {
    this.subscriptions = [
      channel.subscribe('stage.pixel.fill', this.prepareRefresh),
      // channel.subscribe('app.frame.select', this.prepareRefresh),
      // channel.subscribe('app.box.toggle', this.prepareRefresh),
      // channel.subscribe('stage.layer.update', this.prepareRefresh),
    ];
  },
  componentWillUnmount: function() {
    this.subscriptions.forEach(function(subscription) {
      subscription.unsubscribe();
    });
  },
  dispatchLayerSelected: function() {
    channel.publish('app.layer.select', {layer: this.props.id});
  },
  prepareRefresh: function(data) {
    if(this.props.id == data.layer) {
      this.setState({needsRefresh: true, data: data});
    }
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      console.log(this.state.data);
      //console.log('refreshing preview for layer '+this.props.id);
      /*
      var w = this.getDOMNode().clientWidth,
          h = this.getDOMNode().clientHeight,
          sourceCanvas = document.getElementById('StageBoxLayer-'+this.props.id);

      this.getDOMNode().width = this.getDOMNode().width; // clear canvas
      this.getDOMNode().getContext('2d').drawImage(sourceCanvas, 0, 0, w, h);
      this.setState({needsRefresh: false});

      */
      this.resetState();
    }
  },
});