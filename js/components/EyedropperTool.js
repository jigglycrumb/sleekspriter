var EyedropperTool = React.createClass({
  render: function() {
    console.log('rendering EyedropperTool', this.props);
    return (
      <div id="Eyedropper-Tool" className="ToolComponent">
        <i className="icon-target"></i>
        <div id="EyedropperSwatch" className="colorswatch" style={{background: this.props.editor.pixelColor.rgbaString()}}></div>
      </div>
    );
  }
});