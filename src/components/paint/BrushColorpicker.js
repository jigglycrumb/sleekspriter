import React from "react";
import { SketchPicker } from "react-color";

class BrushColorpicker extends React.Component {
  render() {
    return (
      <div className="color-picker">
        <SketchPicker color={this.props.color} onChangeComplete={::this.handleChange} />
      </div>
    );
  }

  handleChange(color) {
    this.props.action(color.hex);
  }
}

export default BrushColorpicker;
