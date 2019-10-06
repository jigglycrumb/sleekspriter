import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { FrameCanvas } from "../canvases";
import { sizeShape } from "../../shapes";

class FrameboxFrame extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.frameCanvas = null;
  }

  componentDidMount() {
    this.props.registerFrameCanvas(this.props.frame, this.frameCanvas);
  }

  componentWillUnmount() {
    this.props.unregisterFrameCanvas(this.props.frame);
  }

  render() {
    const id = this.props.frame; // `FrameBoxFrame-${this.props.frame}`;
    const classes = classnames({
      frame: true,
      selected: this.props.frame === this.props.selected,
      onion: this.props.onionSelected,
    });
    const frameStyle = {
      height: this.props.maxSize,
      width: this.props.maxSize,
    };

    return (
      <div
        key={id}
        className={classes}
        style={frameStyle}
        onClick={this.handleClick}>
        <FrameCanvas
          ref={n => (this.frameCanvas = n)}
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

  handleClick() {
    this.props.frameSelect(this.props.frame);
  }
}

FrameboxFrame.propTypes = {
  frame: PropTypes.number.isRequired,
  frameSelect: PropTypes.func.isRequired,
  layers: PropTypes.array.isRequired,
  maxSize: PropTypes.number.isRequired,
  onionSelected: PropTypes.bool.isRequired,
  pixels: PropTypes.object,
  registerFrameCanvas: PropTypes.func.isRequired,
  selected: PropTypes.number.isRequired,
  size: sizeShape.isRequired,
  unregisterFrameCanvas: PropTypes.func.isRequired,
};

export default FrameboxFrame;
