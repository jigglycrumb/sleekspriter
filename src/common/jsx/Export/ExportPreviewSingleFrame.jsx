var ExportPreviewSingleFrame = React.createClass({
  mixins: [FrameCanvasMixin],
  render: function() {
    var classes = classNames({
      preview: true,
      checkerboard: (this.props.format === 'png' || this.props.format === 'gif') ? true : false,
    });
    return (
      <canvas className={classes} width={this.props.frameSize.width} height={this.props.frameSize.height} />
    )
  }
});