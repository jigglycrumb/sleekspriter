var ExportPreviewAnimation = React.createClass({
  getInitialState: function() {
    return {
      timer: null,
      frameIndex: 0,
    }
  },
  render: function() {
    if(this.props.animation.frames.length > 0) {
      var self = this,
          i = 1,
          frame = this.props.animation.frames[this.state.frameIndex];

      return (
        <div>
          <ExportPreviewSingleFrame
            id={frame}
            width={this.props.width}
            height={this.props.height}
            frameSize={this.props.frameSize}
            format={this.props.format} />
          <div className="animation-frames hidden">
            {this.props.animation.frames.map(function(frame) {
              var key = 'preview-frame-'+i;
              i++;
              return (
                <ExportPreviewSingleFrame
                  key={key}
                  id={frame}
                  width={self.props.width}
                  height={self.props.height}
                  frameSize={self.props.frameSize}
                  format={self.props.format} />
              )
            },this)}
          </div>
        </div>
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