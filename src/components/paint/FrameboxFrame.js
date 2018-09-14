import React from "react";
import classnames from "classnames";
import { FrameCanvas } from "../canvases";

class FrameboxFrame extends React.Component {
  constructor(props) {
    super(props);
    this.select = this.select.bind(this);
  }

  render() {
    const id = `FrameBoxFrame-${this.props.frame}`,
      classes = classnames({
        frame: true,
        selected: this.props.frame == this.props.selected,
        onion: this.props.onionSelected,
      }),
      frameStyle = {
        height: this.props.maxSize,
        width: this.props.maxSize,
      };

    return (
      <div
        key={id}
        className={classes}
        style={frameStyle}
        onClick={this.select}>
        <FrameCanvas
          frame={this.props.frame}
          layers={this.props.layers}
          size={this.props.size}
          maxSize={this.props.maxSize}
          pixels={this.props.pixels}
        />
        <label>{this.props.frame}</label>
      </div>
    );
  }

  select() {
    this.props.frameSelect(this.props.frame);
  }
}

export default FrameboxFrame;
