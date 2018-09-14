import React from "react";

class SelectionPattern extends React.Component {
  constructor() {
    super();

    this.state = {
      size: 10,
      frame: 1,
      frameCountUp: true,
    };

    this.tick = this.tick.bind(this);
  }

  render() {
    return (
      <canvas
        ref={n => (this.canvas = n)}
        id="SelectionPattern"
        width={this.state.size}
        height={this.state.size}
        style={{ height: this.state.size, width: this.state.size }}
      />
    );
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 200);
    this.drawPattern();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate() {
    this.drawPattern();
  }

  tick() {
    let frame = this.state.frame,
      countUp = this.state.frameCountUp;

    if (countUp) {
      frame++;
      if (frame == 4) countUp = false;
    } else {
      frame--;
      if (frame == 1) countUp = true;
    }
    this.setState({ frame: frame, frameCountUp: countUp });
  }

  drawPattern() {
    const frame = this.state.frame,
      ctx = this.canvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, this.state.size, this.state.size);
    ctx.fillStyle = "#000";
    ctx.fillRect(
      frame * (this.state.size / 10),
      0,
      this.state.size / 2,
      this.state.size
    );
    ctx.fillRect(
      0,
      frame * (this.state.size / 10),
      this.state.size,
      this.state.size / 2
    );
  }
}

export default SelectionPattern;
