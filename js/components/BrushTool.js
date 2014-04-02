var BrushTool = React.createClass({
  render: function() {
    return (
      <div id="Brush-Tool" className="ToolComponent">
        <i className="icon flaticon-small23"/>
        <input type="color" id="Brush-Colorpicker" className="ColorSwatch" value={editor.color.hexString()} onChange={this.dispatchColorSelected} title={editor.color.hexString()} />
        <span className="spacer"/>
        <Palette editor={this.props.editor} signal={this.props.signal} />
      </div>
    );
  },
  dispatchColorSelected: function(event) {
    var color = event.target.value;
    signal.colorSelected.dispatch(color);
  }
});