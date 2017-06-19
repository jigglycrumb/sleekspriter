var ExportPreviewSpritesheet = React.createClass({
  render: function() {
    var width = this.props.file.size.width * this.props.ui.export.zoom * this.props.file.frames.x,
        height = this.props.file.size.height * this.props.ui.export.zoom * this.props.file.frames.y,
        classes = {
          preview: true,
          checkerboard: (this.props.ui.export.format === 'png' || this.props.ui.export.format === 'gif') ? true : false,
        },
        style = {
          width: width,
          height: height,
        },
        background = (this.props.ui.export.format === 'png' || this.props.ui.export.format === 'gif') ? null : '#ffffff';

    return (
      <div className={classNames(classes)} style={style}>
        <SpritesheetCanvas file={this.props.file} pixels={this.props.pixels} zoom={this.props.ui.export.zoom} background={background} />
      </div>
    )
  }
});