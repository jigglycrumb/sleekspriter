// Flux: done, editor: done
var ExportPreviewSpritesheet = React.createClass({
  mixins: [SpritesheetCanvasMixin],
  render: function() {
    var width = this.props.frameSize.width * this.props.file.frames.x,
        height = this.props.frameSize.height * this.props.file.frames.y,
        classes = classNames({
          preview: true,
          checkerboard: (this.props.ui.export.format === 'png' || this.props.ui.export.format === 'gif') ? true : false,
        });
    return (
      <canvas className={classes} width={width} height={height} />
    )
  }
});