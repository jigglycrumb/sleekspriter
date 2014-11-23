var DebugSelectionPattern = React.createClass({
  getInitialState: function() {
    return {
      frame: 1,
      frameCountUp: true
    };
  },
  render: function() {
    var size = this.props.zoom;

    return (
      <canvas id="SelectionPattern" width={size} height={size} style={{height: size, width: size}} />
    );
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 200);
    this.drawPattern();
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  componentDidUpdate: function() {
    this.drawPattern();
  },
  tick: function() {
    var frame = this.state.frame,
        countUp = this.state.frameCountUp;

    if(countUp) {
      frame++;
      if(frame == 4) countUp = false;
    }
    else {
      frame--;
      if(frame == 1) countUp = true;
    }
    this.setState({frame: frame, frameCountUp: countUp});
  },
  drawPattern: function() {
    var frame = this.state.frame,
        canvas = this.getDOMNode(),
        ctx = canvas.getContext('2d'),
        size = this.props.zoom;

    ctx.webkitImageSmoothingEnabled = false;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000';
    ctx.fillRect(frame*(size/10), 0, size/2, size);
    ctx.fillRect(0, frame*(size/10), size, size/2);
  },
});