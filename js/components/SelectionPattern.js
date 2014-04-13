var SelectionPattern = React.createClass({
  getInitialState: function() {
    return {
      frame: 1,
      frameCountUp: true,
    };
  },
  render: function() {
    return (
      <canvas id="SelectionPattern" width="10" height="10" />
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

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 10, 10);
    ctx.fillStyle = '#000';
    ctx.fillRect(frame, 0, 5, 10);
    ctx.fillRect(0, frame, 10, 5);
  },
});