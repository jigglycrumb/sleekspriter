import React from "react";
import PropTypes from "prop-types";
import { CustomPicker } from "react-color";
import {
  EditableInput,
  Hue,
  Saturation,
} from "react-color/lib/components/common";

import { Colorswatch } from ".";

class ColorswatchPicker extends React.Component {
  static propTypes = {
    action: PropTypes.func.isRequired,
    color: PropTypes.string.isRequired,
  };

  state = {
    pickerVisible: false,
  };

  constructor(props) {
    super(props);
    this.togglePicker = this.togglePicker.bind(this);
    this.onOutsideClick = this.onOutsideClick.bind(this);
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.onOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.onOutsideClick, false);
  }

  render() {
    const { pickerVisible } = this.state;
    const { hex } = this.props;

    return (
      <div>
        <Colorswatch color={hex} action={this.togglePicker} />

        {pickerVisible && (
          <div className="color-picker" ref={node => (this.node = node)}>
            <div className="title">Pick a color</div>
            <div className="hue">
              <Hue {...this.props} onChange={this.props.onChange} />
            </div>
            <div className="saturation">
              <Saturation {...this.props} onChange={this.props.onChange} />
            </div>
            <div className="input">
              <EditableInput value={hex} onChange={this.props.onChange} />
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

    if (!pickerVisible) {
      const { action, hex } = this.props;
      action(hex);
    }
  }

  onOutsideClick(e) {
    if (this.node && !this.node.contains(e.target)) {
      this.togglePicker();
    }
  }
}

export default CustomPicker(ColorswatchPicker);
