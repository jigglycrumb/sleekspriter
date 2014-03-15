var BrushTool = React.createClass({
  render: function() {
    return (
      <div id="Brush-Tool" className="ToolComponent">
        <i className="icon-brush"></i>
        <input type="color" id="Brush-Colorpicker" className="ColorSwatch" value={editor.color.hexString()} onChange={this.dispatchColorSelected} />
      </div>
    );
  },
  dispatchColorSelected: function(event) {
    var color = event.target.value;
    signal.colorSelected.dispatch(color);
  }
});