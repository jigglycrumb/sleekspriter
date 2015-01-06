var ExportPreviewSpritesheet = React.createClass({
  mixins: [PostalSubscriptionMixin, SpritesheetCanvasMixin],
  render: function() {
    var width = this.props.frameSize.width * this.props.frames.x,
        height = this.props.frameSize.height * this.props.frames.y,
        classes = React.addons.classSet({
          preview: true,
          checkerboard: (this.props.format === 'png' || this.props.format === 'gif') ? true : false,
        });
    return (
      <canvas className={classes} width={width} height={height} />
    )
  }
});