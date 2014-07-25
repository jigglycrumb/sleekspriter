/** @jsx React.DOM */
var EyedropperTool = React.createClass({
  render: function() {
    var color = this.props.editor.color.frame;
    return (
      <div id="Eyedropper-Tool" className="ToolComponent">
        <i className="icon flaticon-eyedropper2"></i>
        <div id="EyedropperSwatch" className="colorswatch" style={{background: color.rgbaString()}}></div>
        <ul>
          <li>Hex: {color.alpha() == 0 ? '': color.hexString()}</li>
          <li>RGB: {color.alpha() == 0 ? '': color.red()+', '+color.green()+', '+color.blue()}</li>
        </ul>
        <span className="spacer"></span>
        <span className="hint">Click any non-transparent pixel to pick its color.</span>

      </div>
    );
  }
});