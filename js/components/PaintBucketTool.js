var PaintBucketTool = React.createClass({
  render: function() {
    return (
      <div id="PaintBucket-Tool" className="ToolComponent">
        <i className="icon flaticon-paint2"/>
        <input type="color" id="PaintBucket-Colorpicker" className="ColorSwatch" value={editor.color.hexString()} onChange={this.dispatchColorSelected} title={editor.color.hexString()} />
        <span className="spacer"/>
        <Palette editor={this.props.editor} signal={this.props.signal} />
      </div>
    );
  },
  dispatchColorSelected: function(event) {
    var color = event.target.value;
    channel.publish('app.color.select', {color: color});
  }
});