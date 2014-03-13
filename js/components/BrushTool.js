var BrushTool = React.createClass({
  render: function() {
    return (
      <div id="Brush-Tool" className="ToolComponent">
        <i className="icon-brush"></i>
        <input type="color" id="Brush-Colorpicker" className="ColorSwatch" defaultValue={editor.color.hexString()} onChange={this.dispatchColorPicked} />
      </div>
    );
  },
  dispatchColorPicked: function(event) {
    var color = event.target.value;
    signal.colorPicked.dispatch(color);
  }
});