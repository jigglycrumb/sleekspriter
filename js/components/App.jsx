/** @jsx React.DOM */
var App = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      subscriptions: {
        'app.frame.select': this.updateProps,
        'app.layer.select': this.updateProps,
        'app.tool.select': this.updateProps,
        'app.color.select': this.updateProps,
        'app.cursor.set': this.updateProps,
        'app.palette.select': this.updateProps,
        'app.brightnesstool.mode.select': this.updateProps,
        'app.brightnesstool.intensity.select': this.updateProps,

        'stage.grid.toggle': this.updateProps,
        'stage.zoom.select': this.updateProps,
        //'stage.tool.move': this.updateProps,

        'file.layer.opacity.select': this.updateProps,
        'file.layer.visibility.toggle': this.updateProps,

        'file.save': this.updateProps,
      }
    }
  },
  render: function() {

    var totalFrames = this.props.editor.file.frames.x * this.props.editor.file.frames.y,
        frames = [];

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    return (
      <div id="App">
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
        <div className="area offscreen">
          {frames.map(function(frame) {
            var id = 'OffscreenFrameCanvas-'+frame;
            return (
              <OffscreenFrameCanvas
                key={id}
                id={frame}
                width={this.props.editor.file.size.width}
                height={this.props.editor.file.size.height}
                selectedframe={this.props.editor.frame.selected} />
            );
          }, this)}

          <SelectionPattern editor={this.props.editor} />
        </div>
      </div>
    );
  },
  updateProps: function() {
    this.setProps({editor: editor, workspace: workspace});
  }
});