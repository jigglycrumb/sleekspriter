// Use only in <canvas> components
var CopyFrameMixin = {
  propTypes: {
    frame: React.PropTypes.number.isRequired
  },
  componentDidMount: function() {
    this.props.signal.frameContentChanged.add(this.prepareRefresh);
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
      var w = this.getDOMNode().clientWidth,
          h = this.getDOMNode().clientHeight,
          sourceCanvas = document.getElementById('OffscreenFrameCanvas-'+this.props.frame);

      this.getDOMNode().width = this.getDOMNode().width; // clear canvas
      this.getDOMNode().getContext('2d').webkitImageSmoothingEnabled = false;
      this.getDOMNode().getContext('2d').drawImage(sourceCanvas, 0, 0, w, h);
      this.setState({needsRefresh: false});
    }
  }
};