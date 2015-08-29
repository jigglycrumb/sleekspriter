var ExportPreviewSingleFrame = React.createClass({
  render: function() {
    var classes = {
          preview: true,
          checkerboard: (this.props.ui.export.format === 'png' || this.props.ui.export.format === 'gif') ? true : false,
        },
        style = {
          width: this.props.file.size.width*this.props.ui.export.zoom,
          height: this.props.file.size.height*this.props.ui.export.zoom,
        };

    return (
      <div className={classNames(classes)} style={style}>
        <FrameCanvas frame={this.props.frame} file={this.props.file} pixels={this.props.pixels} zoom={this.props.ui.export.zoom} />
      </div>
    )
  }
});