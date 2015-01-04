var ExportPreviewSingleFrame = React.createClass({
  mixins: [PostalSubscriptionMixin, FrameCanvasMixin],
  render: function() {
    var classes = React.addons.classSet({
      preview: true,
      checkerboard: (this.props.format === 'png' || this.props.format === 'gif') ? true : false,
    });
    return (
      <canvas className={classes} width={this.props.frameSize.width} height={this.props.frameSize.height} />
    )
  }
});