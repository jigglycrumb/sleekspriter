import React from "react";
import { SketchPicker } from "react-color";

class BrushColorpicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div className="color-picker">
        <SketchPicker
          color={this.props.color}
          onChangeComplete={this.handleChange}
        />
      </div>
    );
  }

  handleChange(color) {
    this.props.action(color.hex);
  }
}

export default BrushColorpicker;
