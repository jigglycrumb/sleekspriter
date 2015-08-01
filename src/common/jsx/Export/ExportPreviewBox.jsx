var ExportPreviewBox = React.createClass({
  render: function() {
    var preview = null,
        backgroundColor = this.props.format === 'jpeg' ? '#ffffff' : 'transparent';
        frameSize = {
          width: this.props.dimensions.width * this.props.zoom,
          height: this.props.dimensions.height * this.props.zoom,
        };

    switch(this.props.part) {
      case 'spritesheet':
        preview = <ExportPreviewSpritesheet
                    id={this.props.frame}
                    width={this.props.dimensions.width}
                    height={this.props.dimensions.height}
                    frameSize={frameSize}
                    format={this.props.format}
                    frames={this.props.frames}
                    zoom={this.props.zoom}
                    backgroundColor={backgroundColor} />
        break;

      case 'allframes':
        preview = <ExportPreviewAllFrames
                    width={this.props.dimensions.width}
                    height={this.props.dimensions.height}
                    frameSize={frameSize}
                    format={this.props.format}
                    frames={this.props.frames}
                    backgroundColor={backgroundColor}
                    ui={this.props.ui}
                    file={this.props.file}  />
        break;

      case 'oneframe':
        preview = <ExportPreviewSingleFrame
                    id={this.props.frame}
                    width={this.props.dimensions.width}
                    height={this.props.dimensions.height}
                    frameSize={frameSize}
                    format={this.props.format}
                    backgroundColor={backgroundColor}
                    ui={this.props.ui}
                    file={this.props.file}  />
        break;

      case 'animation':
        preview = <ExportPreviewAnimation
                    id={this.props.frame}
                    width={this.props.dimensions.width}
                    height={this.props.dimensions.height}
                    frameSize={frameSize}
                    format={this.props.format}
                    animation={storeUtils.animations.getById(this.props.animation)}
                    ui={this.props.ui}
                    file={this.props.file}  />
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