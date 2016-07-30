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

        <div
          className="colorswatch"
          style={{background: hex}}
          title={hex}
          onClick={this.togglePicker}
        />

        <PixelColorPicker color={hex} visible={this.state.pickerVisible} />

        <span className="spacer"/>
        <Palette ui={this.props.ui} />
      </div>
    );
  },
  togglePicker: function() {
    this.setState({pickerVisible: !this.state.pickerVisible});
  }
});
