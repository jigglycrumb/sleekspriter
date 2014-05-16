var App = React.createClass({
  render: function() {

    var totalFrames = this.props.file.frames.x * this.props.file.frames.y,
        frames = [];

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    return (
      <div id="App">
        <div className="area top">
          <ToolContainer editor={this.props.editor} signal={this.props.signal} />
        </div>
        <div className="area left">
          <ToolBox editor={this.props.editor} signal={this.props.signal} />
        </div>
        <div className="area center">
          <StageBox file={this.props.file} editor={this.props.editor} signal={this.props.signal} pixel={this.props.pixel}/>
        </div>
        <div className="area right">
          <div id="layerboxhelper">
            <PreviewBox file={this.props.file} editor={this.props.editor} signal={this.props.signal} workspace={this.props.workspace} fold="preview" />
            <FrameBox file={this.props.file} editor={this.props.editor} signal={this.props.signal} workspace={this.props.workspace} fold="frames" />
          </div>
          <LayerBox file={this.props.file} editor={this.props.editor} signal={this.props.signal} workspace={this.props.workspace} fold="layers" />
        </div>
        <div className="area bottom">
          <StatusBar editor={this.props.editor} signal={this.props.signal} />
        </div>
        <div className="area offscreen">
          {frames.map(function(frame) {
            var id = 'OffscreenFrameCanvas-'+frame;
            return (
              <OffscreenFrameCanvas key={id} frame={frame} file={this.props.file} editor={this.props.editor} signal={this.props.signal} />
            );
          }, this)}

          <SelectionPattern editor={this.props.editor} />
        </div>
      </div>
    );
  },
  componentDidMount: function() {
    var self = this,
        subscriptions = [
          'pixelSelected',
          'layerRemoved',
          'layerAdded',
          'pixelsMoved',
        ];

    subscriptions.forEach(function(item) {
      self.props.signal[item].add(self.updateProps);
    });


    channel.subscribe('stage.grid.toggle', this.updateProps);
    channel.subscribe('stage.zoom.select', this.updateProps);

    channel.subscribe('app.tool.select', this.updateProps);
    channel.subscribe('app.color.select', this.updateProps);
    channel.subscribe('app.frame.select', this.updateProps);
    channel.subscribe('app.palette.select', this.updateProps);
    channel.subscribe('app.box.toggle', this.updateProps);
    channel.subscribe('app.layer.select', this.updateProps);

    channel.subscribe('app.brightnesstool.mode.select', this.updateProps);
    channel.subscribe('app.brightnesstool.intensity.select', this.updateProps);

    channel.subscribe('file.layer.opacity.select', this.updateProps);
    channel.subscribe('file.layer.visibility.toggle', this.updateProps);
    channel.subscribe('file.layer.name.select', this.updateProps);
  },
  updateProps: function() {
    //console.log('updating App props');
    this.setProps({
      editor: editor,
      file: file
    });
  },
});