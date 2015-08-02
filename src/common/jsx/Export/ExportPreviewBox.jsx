var ExportPreviewBox = React.createClass({
  render: function() {
    var preview = null,
        backgroundColor = this.props.ui.export.format === 'jpeg' ? '#ffffff' : 'transparent';
        frameSize = {
          width: this.props.file.size.width * this.props.ui.export.zoom,
          height: this.props.file.size.height * this.props.ui.export.zoom,
        };

    switch(this.props.ui.export.part) {
      case 'spritesheet':
        preview = <ExportPreviewSpritesheet
                    id={this.props.ui.export.frame}
                    zoom={this.props.ui.export.zoom}
                    frameSize={frameSize}
                    backgroundColor={backgroundColor}
                    ui={this.props.ui}
                    file={this.props.file} />
        break;

      case 'allframes':
        preview = <ExportPreviewAllFrames
                    width={this.props.file.size.width}
                    height={this.props.file.size.height}
                    frameSize={frameSize}
                    format={this.props.ui.export.format}
                    backgroundColor={backgroundColor}
                    ui={this.props.ui}
                    file={this.props.file} />
        break;

      case 'oneframe':
        preview = <ExportPreviewSingleFrame
                    id={this.props.ui.export.frame}
                    width={this.props.file.size.width}
                    height={this.props.file.size.height}
                    frameSize={frameSize}
                    backgroundColor={backgroundColor}
                    ui={this.props.ui}
                    file={this.props.file} />
        break;

      case 'animation':
        preview = <ExportPreviewAnimation
                    id={this.props.ui.export.frame}
                    width={this.props.file.size.width}
                    height={this.props.file.size.height}
                    frameSize={frameSize}
                    animation={storeUtils.animations.getById(this.props.ui.export.animation)}
                    ui={this.props.ui}
                    file={this.props.file} />
        break;
    }

    return (
      <div id="ExportPreviewBox">
        <h5>Preview</h5>
        <div id="ExportPreview" ref="inner" className="inner">
          {preview}
        </div>
      </div>
    )
  },
});