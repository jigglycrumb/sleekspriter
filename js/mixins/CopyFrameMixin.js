// Use only in <canvas> components
var CopyFrameMixin = {
  propTypes: {
    frame: React.PropTypes.number.isRequired
  },
  componentDidMount: function() {
    this.props.signal.frameContentChanged.add(this.prepareRefresh);
    //this.props.signal.frameSelected.add(this.prepareRefresh);
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
      //console.log('updating preview', this.props.layer);
      var sourceCanvas = document.getElementById('OffscreenFrameCanvas-'+this.props.frame);
      this.getDOMNode().width = this.getDOMNode().width;
      this.getDOMNode().getContext('2d').drawImage(sourceCanvas, 0, 0);
      this.setState({needsRefresh: false});
    }
  }
};