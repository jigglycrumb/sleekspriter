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
            id={frame}
            width={this.props.width}
            height={this.props.height}
            frameSize={this.props.frameSize}
            backgroundColor={this.props.backgroundColor}
            ui={this.props.ui}
            file={this.props.file} />
        )
      }, this)}
      </div>
    )
  }
});