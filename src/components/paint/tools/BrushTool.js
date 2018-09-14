import React from "react";
import PaletteContainer from "../../containers/PaletteContainer";
import Colorswatch from "../Colorswatch";
import BrushColorpicker from "../BrushColorpicker";

class BrushTool extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pickerVisible: false,
    };

    this.togglePicker = this.togglePicker.bind(this);
  }

  render() {
    const picker = !this.state.pickerVisible ? null : (
      <BrushColorpicker
        color={this.props.color}
        action={this.props.brushColor}
      />
    );

    return (
      <div id="Brush-Tool" className="ToolComponent">
        <i className="icon flaticon-small23" />
        <Colorswatch color={this.props.color} action={this.togglePicker} />
        {picker}
        <span className="spacer" />
        <div className="palette">
          <PaletteContainer />
        </div>
      </div>
    );
  }

  togglePicker() {
    this.setState({ pickerVisible: !this.state.pickerVisible });
  }
}

export default BrushTool;
