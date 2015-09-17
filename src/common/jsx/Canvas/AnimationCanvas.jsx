var AnimationCanvas = React.createClass({
  getInitialState: function() {
    return {
      timer: null,
      frameIndex: 0,
    }
  },
  render: function() {
    if(this.props.animation !== null && this.props.animation.frames.length > 0) {
      var self = this,
          i = 1,
          frame = this.props.animation.frames[this.state.frameIndex] || 1;

      return (
        <FrameCanvas frame={frame} file={this.props.file} pixels={this.props.pixels} maxSize={this.props.maxSize} />
      )
    }
  },
  componentDidUpdate: function(prevProps) {
    if(this.animationIsDifferent(this.props.animation, prevProps.animation)) {
      this.stop();
      if(this.props.play === true) this.start();
    }
    else if(prevProps.play === false && this.props.play === true) this.start();
    else if(prevProps.play === true && this.props.play === false) this.stop();
  },
  componentDidMount: function() {
    if(this.props.play === true) this.start();
  },
  componentWillUnmount: function() {
    clearTimeout(this.state.timer);
  },
  animationIsDifferent: function(animation1, animation2) {
    var diff = false;
    for(x in animation1) {
      if(animation1[x] !== animation2[x]) {
        diff = true;
        break;
      }
    }
    if(diff === false) diff = !_.isEqual(animation1.frames, animation2.frames);
    return diff;
  },
  start: function() {
    this.nextFrame();
  },
  stop: function() {
    clearTimeout(this.state.timer);
    this.setState(this.getInitialState());
  },
  nextFrame: function() {
    if(this.isMounted()) {
      clearTimeout(this.state.timer);
      var index = this.state.frameIndex;
      index++;
      if(index >= this.props.animation.frames.length) index = 0;
      var ms = 1000 / this.props.animation.fps,
          timeout = setTimeout(this.nextFrame, ms);
      this.setState({frameIndex: index, timer: timeout});
    }
  },
});