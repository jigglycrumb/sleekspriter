// Use only in <canvas> components
var CopyFrameMixin = {
  propTypes: {
    frame: React.PropTypes.number.isRequired
  },
  componentDidMount: function() {
    this.subscription = channel.subscribe('stage.frame.update', this.prepareRefresh);
  },
  compontentWillUnmount: function() {
    this.subscription.unsubscribe();
  },
  getInitialState: function() {
    return {
      needsRefresh: false
    };
  },
  prepareRefresh: function() {
    this.setState({needsRefresh: true});
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      this.drawFrame();
      this.setState({needsRefresh: false});
    }
  },
  drawFrame: function() {
    var w = this.getDOMNode().clientWidth,
        h = this.getDOMNode().clientHeight,
        sourceCanvas = document.getElementById('OffscreenFrameCanvas-'+this.props.frame);

    this.getDOMNode().width = this.getDOMNode().width; // clear canvas
    this.getDOMNode().getContext('2d').webkitImageSmoothingEnabled = false;
    this.getDOMNode().getContext('2d').drawImage(sourceCanvas, 0, 0, w, h);
  },
};