// Flux: done
var PaintBucketTool = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    var hex = this.props.ui.color.brush.hexString();
    return (
      <div id="PaintBucket-Tool" className="ToolComponent">
        <i className="icon flaticon-paint2"/>
        <input type="color" id="PaintBucket-Colorpicker" className="ColorSwatch" value={hex} onChange={this.dispatchColorSelected} title={hex} />
        <span className="spacer"/>
        <Palette ui={this.props.ui} />
      </div>
    );
  },
  dispatchColorSelected: function(event) {
    this.getFlux().actions.colorBrush(event.target.value);
  }
});