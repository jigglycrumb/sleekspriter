var ExportPreviewBox = React.createClass({
  render: function() {
    var preview = null,
        backgroundColor = this.props.ui.export.format === 'jpeg' ? '#ffffff' : 'transparent';

    switch(this.props.ui.export.part) {
      case 'spritesheet':
        preview = <ExportPreviewSpritesheet
                    id={this.props.ui.export.frame}
                    zoom={this.props.ui.export.zoom}
                    backgroundColor={backgroundColor}
                    frameSize={this.props.file.width*this.props.ui.zoom}
                    ui={this.props.ui}
                    file={this.props.file}
                    pixels={this.props.pixels} />
        break;

      case 'allframes':
        preview = <ExportPreviewAllFrames
                    ui={this.props.ui}
                    file={this.props.file}
                    pixels={this.props.pixels} />
        break;

      case 'oneframe':
        preview = <ExportPreviewSingleFrame
                    frame={this.props.ui.export.frame}
                    ui={this.props.ui}
                    file={this.props.file}
                    pixels={this.props.pixels} />
        break;

      case 'animation':
        preview = <ExportPreviewAnimation
                    animation={storeUtils.animations.getById(this.props.ui.export.animation)}
                    ui={this.props.ui}
                    file={this.props.file}
                    pixels={this.props.pixels} />
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