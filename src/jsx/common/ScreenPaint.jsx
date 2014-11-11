/** @jsx React.DOM */
var ScreenPaint = React.createClass({
  render: function() {
    var totalFrames = this.props.editor.file.frames.x * this.props.editor.file.frames.y,
        frames = [],
        settingsBoxStyle = {
          display: this.props.editor.settingsVisible === true ? 'block' : 'none',
        };

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    return (
      <section className="screen paint">
        <div className="area top">
          <ToolContainer editor={this.props.editor} />
        </div>
        <div className="area left">
          <ToolBox editor={this.props.editor} />
        </div>
        <div className="area center">
          <StageBox editor={this.props.editor} />
        </div>
        <div className="area right">
          <div id="layerboxhelper">
            <PreviewBox editor={this.props.editor} workspace={this.props.workspace} fold="preview" />
            <FrameBox editor={this.props.editor} workspace={this.props.workspace} fold="frames" />
          </div>
          <LayerBox editor={this.props.editor} workspace={this.props.workspace} fold="layers" />
        </div>
        <div className="area bottom">
          <StatusBar editor={this.props.editor} />
        </div>
        <div className="area settings" style={settingsBoxStyle}>
          <SettingsBox editor={this.props.editor} />
        </div>
      </section>
    )
  }
});