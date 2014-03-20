var App = React.createClass({
  render: function() {
    return (
      <div>
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
          <LayerBox io={this.props.io} editor={this.props.editor} signal={this.props.signal} />
        </div>
        <div className="area bottom">
          <StatusBar editor={this.props.editor} signal={this.props.signal} />
        </div>
        <div className="area offscreen">
          <CompositeCanvas io={this.props.io} editor={this.props.editor} signal={this.props.signal} />
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