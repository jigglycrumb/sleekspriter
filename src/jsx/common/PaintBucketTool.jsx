/** @jsx React.DOM */
var PaintBucketTool = React.createClass({
  render: function() {
    var hex = editor.color.brush.hexString();
    return (
      <div id="PaintBucket-Tool" className="ToolComponent">
        <i className="icon flaticon-paint2"/>
        <input type="color" id="PaintBucket-Colorpicker" className="ColorSwatch" value={hex} onChange={this.dispatchColorSelected} title={hex} />
        <span className="spacer"/>
        <Palette editor={this.props.editor} />
      </div>
    );
  },
  dispatchColorSelected: function(event) {
    var color = event.target.value;
    channel.publish('color.select', {color: color});
  }
});