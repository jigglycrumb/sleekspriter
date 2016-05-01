// Flux: done
var BrushTool = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    var hex = this.props.ui.color.brush.hexString();
    return (
      <div id="Brush-Tool" className="ToolComponent">
        <i className="icon flaticon-small23"></i>
        <input type="color" id="Brush-Colorpicker" className="ColorSwatch" value={hex} onChange={this.dispatchColorSelected} title={hex} />
        <span className="spacer"/>
        <Palette ui={this.props.ui} />
      </div>
    );
  },
  dispatchColorSelected: function(event) {
    this.getFlux().actions.colorBrush(event.target.value);
  }
});
