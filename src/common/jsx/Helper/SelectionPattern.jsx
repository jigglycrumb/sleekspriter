var SelectionPattern = React.createClass({
  getInitialState: function() {
    return {
      size: 10,
      frame: 1,
      frameCountUp: true
    };
  },
  render: function() {
    return (
      <canvas id="SelectionPattern" width={this.state.size} height={this.state.size} style={{height: this.state.size, width: this.state.size}} />
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
        ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, this.state.size, this.state.size);
    ctx.fillStyle = '#000';
    ctx.fillRect(frame*(this.state.size/10), 0, this.state.size/2, this.state.size);
    ctx.fillRect(0, frame*(this.state.size/10), this.state.size, this.state.size/2);
  },
});