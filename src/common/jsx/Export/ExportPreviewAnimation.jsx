var ExportPreviewAnimation = React.createClass({
  getInitialState: function() {
    return {
      timer: null,
      frameIndex: 0,
    }
  },
  render: function() {
    if(this.props.animation.frames.length > 0) {
      var frame = this.props.animation.frames[this.state.frameIndex];
      return (
        <ExportPreviewSingleFrame
          key={frame}
          id={frame}
          width={this.props.width}
          height={this.props.height}
          frameSize={this.props.frameSize}
          format={this.props.format} />
      )
    }
    else return (
      <span>This animation does not contain any frames and cannot be exported.</span>
    )
  },
  componentDidUpdate: function(prevProps) {
    if(this.props.animation.name !== prevProps.animation.name) {
      this.stop();
      this.start();
    }
  },
  componentDidMount: function() {
    this.start();
  },
  componentWillUnmount: function() {
    clearInterval(this.state.timer);
  },


  start: function() {
    if(this.state.timer === null && this.props.animation.frames.length > 0) {
      var ms = 1000 / this.props.animation.fps,
          interval = setInterval(this.nextFrame, ms);
      this.setState({timer: interval});
    }
  },
  stop: function() {
    if(this.state.timer !== null) {
      clearInterval(this.state.timer);
      this.setState(this.getInitialState());
    }
  },
  nextFrame: function() {
    var index = this.state.frameIndex;
    index++;
    if(index === this.props.animation.frames.length) index = 0;
    if(this.isMounted()) this.setState({frameIndex: index});
  },
});