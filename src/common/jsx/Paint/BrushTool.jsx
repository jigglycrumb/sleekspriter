var BrushTool = React.createClass({
  getInitialState: function() {
    return {
      pickerVisible: false
    };
  },
  render: function() {
    var hex = this.props.ui.color.brush.hexString();
    return (
      <div id="Brush-Tool" className="ToolComponent">
        <i className="icon flaticon-small23"></i>
        {/*<input type="color" id="Brush-Colorpicker" className="ColorSwatch" value={hex} onChange={this.dispatchColorSelected} title={hex} />*/}

        <div
          className="colorswatch"
          style={{background: hex}}
          title={hex}
          onClick={this.togglePicker}
        />

        <CustomColorPicker color={hex} visible={this.state.pickerVisible} />

        <span className="spacer"/>
        <Palette ui={this.props.ui} />
      </div>
    );
  },
  togglePicker: function() {
    console.log('click');
    this.setState({pickerVisible: !this.state.pickerVisible});
  }
});
