import React from "react";
import PaletteContainer from "../../../containers/PaletteContainer";
import Colorswatch from "../Colorswatch";

class BrushTool extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pickerVisible: false
    };
  }

  render() {
    return (
      <div id="Brush-Tool" className="ToolComponent">
        <i className="icon flaticon-small23"></i>
        <Colorswatch color={this.props.color} action={::this.togglePicker} />

        {/*<PixelColorPicker color={hex} visible={this.state.pickerVisible} />*/}

        <span className="spacer"/>
        <div className="palette">
          <PaletteContainer />
        </div>
      </div>
    );
  }

  togglePicker() {
    console.log("togglePicker");
    this.setState({pickerVisible: !this.state.pickerVisible});
  }
}

export default BrushTool;
