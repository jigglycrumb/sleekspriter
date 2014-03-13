var App = React.createClass({
  render: function() {
    return (
      <div>
        <div className="area top"></div>
        <div className="area left">
          <ToolBox signal={this.props.signal} />
        </div>
        <div className="area center">
          <StageBox io={this.props.io} editor={this.props.editor} signal={this.props.signal} pixel={this.props.pixel}/>
        </div>
        <div className="area right">
          <LayerBox io={this.props.io} editor={this.props.editor} signal={this.props.signal} />
        </div>
        <div className="area bottom">
          <StatusBar editor={this.props.editor} signal={this.props.signal} />
        </div>
      </div>
    );
  },
  componentDidMount: function() {
    //console.log('mounted App');

    var self = this,
        subscriptions = [
          'gridToggled',
          'pixelSelected',
          'layerRemoved',
          'layerAdded',
          'layerSelected',
          'layerVisibilityChanged',
          'layerOpacityChanged',
          'layerNameChanged',
          'zoomChanged'
          //'frameContentChanged'
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