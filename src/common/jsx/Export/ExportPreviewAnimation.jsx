var ExportPreviewAnimation = React.createClass({
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
        <div>
          <ExportPreviewSingleFrame
            id={frame}
            width={this.props.width}
            height={this.props.height}
            frameSize={this.props.frameSize}
            format={this.props.format}
            ui={this.props.ui}
            file={this.props.file} />

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
                  format={self.props.format}
                  ui={this.props.ui}
                  file={this.props.file} />
              )
            },this)}
          </div>
        </div>
      )
    }
    else {
      clearTimeout(this.state.timer);
      return (
        <span>This animation does not contain any frames and cannot be exported.</span>
      )
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if(this.animationIsDifferent(this.props.animation, nextProps.animation)) this.stop();
  },
  componentDidUpdate: function(prevProps) {
    if(this.animationIsDifferent(this.props.animation, prevProps.animation)) this.start();
  },
  componentDidMount: function() {
    this.start();
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
    if(this.state.timer === null && this.props.animation.frames.length > 0) {
      this.nextFrame();
    }
  },
  stop: function() {
    if(this.state.timer !== null) {
      clearTimeout(this.state.timer);
      this.setState(this.getInitialState());
    }
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