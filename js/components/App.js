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
          <PreviewBox file={this.props.file} editor={this.props.editor} signal={this.props.signal} />
          <FrameBox file={this.props.file} editor={this.props.editor} signal={this.props.signal} />
          <LayerBox file={this.props.file} editor={this.props.editor} signal={this.props.signal} />
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

          <SelectionPattern />
        </div>
      </div>
    );
  },
  componentDidMount: function() {
    var self = this,
        subscriptions = [
          'frameSelected',
          'toolSelected',
          'colorSelected',
          'gridToggled',
          'pixelSelected',
          'layerRemoved',
          'layerAdded',
          'layerSelected',
          'layerVisibilityChanged',
          'layerOpacityChanged',
          'layerNameChanged',
          'zoomChanged',

          'brightnessToolModeChanged',
          'brightnessToolIntensityChanged',
          'paletteSelected',
        ];

    subscriptions.forEach(function(item) {
      self.props.signal[item].add(self.updateProps);
    });

  },
  updateProps: function() {
    //console.log('updating App props');
    this.setProps({
      editor: editor,
      file: file
    });
  },
});