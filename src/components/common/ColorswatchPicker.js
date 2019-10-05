import React from "react";
import PropTypes from "prop-types";
import { CustomPicker } from "react-color";
import {
  EditableInput,
  Hue,
  Saturation,
} from "react-color/lib/components/common";

import { Colorswatch } from ".";

const TICK_INTERVAL = 250;

class ColorswatchPicker extends React.Component {
  state = {
    pickerVisible: false,
  };

  constructor(props) {
    super(props);
    this.ticker = null;

    this.togglePicker = this.togglePicker.bind(this);
    this.onOutsideClick = this.onOutsideClick.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.onOutsideClick, true);
  }

  render() {
    const { pickerVisible } = this.state;
    const { hex } = this.props;

    return (
      <div>
        <Colorswatch
          color={hex}
          action={this.togglePicker}
          className="from-color-picker"
        />

        {pickerVisible && (
          <div className="color-picker" ref={node => (this.picker = node)}>
            <div className="title">Pick a color</div>
            <div className="hue">
              <Hue {...this.props} />
            </div>
            <div className="saturation">
              <Saturation {...this.props} />
            </div>
            <div className="input">
              <EditableInput
                value={hex}
                label="hex"
                onChange={this.props.onChange}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  togglePicker() {
    const pickerVisible = !this.state.pickerVisible;
    this.setState({
      pickerVisible,
    });

    this.startTicking(pickerVisible);

    if (pickerVisible) {
      document.addEventListener("click", this.onOutsideClick, true);
    }

    if (!pickerVisible) {
      const { action, hex } = this.props;
      action(hex);
      document.removeEventListener("click", this.onOutsideClick, true);
    }
  }

  onOutsideClick(e) {
    e.stopPropagation();

    if (this.picker && !this.picker.contains(e.target)) {
      this.togglePicker();
    }
  }

  startTicking(startTicking = true) {
    if (startTicking === true) {
      this.ticker = setInterval(this.tick, TICK_INTERVAL);
    } else {
      clearInterval(this.ticker);
      this.ticker = null;
    }
  }

  tick() {
    const { action, hex } = this.props;
    action(hex);
  }
}

ColorswatchPicker.propTypes = {
  action: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  hex: PropTypes.string,
  onChange: PropTypes.func,
};

export default CustomPicker(ColorswatchPicker);
