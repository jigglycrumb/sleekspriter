var ExportPreviewAllFrames = React.createClass({
  render: function() {
    var frames = [];
    for(var i=0; i < this.props.ui.frames.total; i++) frames.push(i+1);
    return (
      <div>
      {frames.map(function(frame) {
        return (
          <ExportPreviewSingleFrame
            key={frame}
            frame={frame}
            ui={this.props.ui}
            file={this.props.file}
            pixels={this.props.pixels} />
        )
      }, this)}
      </div>
    )
  }
});