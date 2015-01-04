var ExportPreviewAllFrames = React.createClass({
  render: function() {
    var frames = [];
    for(var i=0; i < this.props.frames.total; i++) frames.push(i+1);
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
            format={this.props.format} />
        )
      }, this)}
      </div>
    )
  }
});