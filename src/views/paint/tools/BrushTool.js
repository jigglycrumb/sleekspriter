import React from "react";

class BrushTool extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pickerVisible: false
    };

    this.togglePicker = this.togglePicker.bind(this);
  }

  render() {
    // var hex = this.props.ui.color.brush.hexString();

    var hex = "#FFFFFF";

    return (
      <div id="Brush-Tool" className="ToolComponent">
        <i className="icon flaticon-small23"></i>

        <div
          className="colorswatch"
          style={{background: hex}}
          title={hex}
          onClick={this.togglePicker}
        />

        {/*<PixelColorPicker color={hex} visible={this.state.pickerVisible} />*/}

        <span className="spacer"/>
        {/*<Palette ui={this.props.ui} />*/}
      </div>
    );
  }

  togglePicker() {
    this.setState({pickerVisible: !this.state.pickerVisible});
  }
}

export default BrushTool;
