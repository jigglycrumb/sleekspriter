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
                    frames={this.props.frames} />
        break;

      case 'oneframe':
        preview = <ExportPreviewSingleFrame
                    id={this.props.frame}
                    width={this.props.dimensions.width}
                    height={this.props.dimensions.height}
                    frameSize={frameSize}
                    format={this.props.format}
                    backgroundColor={backgroundColor} />
        break;

      case 'animation':
        preview = <ExportPreviewAnimation
                    id={this.props.frame}
                    width={this.props.dimensions.width}
                    height={this.props.dimensions.height}
                    frameSize={frameSize}
                    format={this.props.format}
                    animation={editor.animations.getByName(this.props.animation)} />
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