// Flux: done, editor: done
var ExportPreviewSingleFrame = React.createClass({
  mixins: [FrameCanvasMixin],
  render: function() {
    var classes = classNames({
      preview: true,
      checkerboard: (this.props.ui.export.format === 'png' || this.props.ui.export.format === 'gif') ? true : false,
    });
    return (
      <canvas className={classes} width={this.props.frameSize.width} height={this.props.frameSize.height} />
    )
  }
});