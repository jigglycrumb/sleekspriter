var App = React.createClass({
  render: function() {

    var totalFrames = this.props.io.frames.x * this.props.io.frames.y,
        frames = [];

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    return (
      <div id="App">
        <div className="area top">
          <ToolContainer editor={this.props.editor} />
        </div>
        <div className="area left">
          <ToolBox editor={this.props.editor} signal={this.props.signal} />
        </div>
        <div className="area center">
          <StageBox io={this.props.io} editor={this.props.editor} signal={this.props.signal} pixel={this.props.pixel}/>
        </div>
        <div className="area right">
          <PreviewBox io={this.props.io} editor={this.props.editor} signal={this.props.signal} />
          <FrameBox io={this.props.io} editor={this.props.editor} signal={this.props.signal} />
          <LayerBox io={this.props.io} editor={this.props.editor} signal={this.props.signal} />
        </div>
        <div className="area bottom">
          <StatusBar editor={this.props.editor} signal={this.props.signal} />
        </div>
        <div className="area offscreen">
          {frames.map(function(frame) {
            var id = 'OffscreenFrameCanvas-'+frame;
            return (
              <OffscreenFrameCanvas key={id} frame={frame} io={this.props.io} editor={this.props.editor} signal={this.props.signal} />
            );
          }, this)}
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
          'zoomChanged'
        ];

    subscriptions.forEach(function(item) {
      self.props.signal[item].add(self.updateProps);
    });


  },
  updateProps: function() {
    //console.log('updating App props');
    this.setProps({
      editor: editor,
      io: io
    });
  }

});