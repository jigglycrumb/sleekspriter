var ExportPreviewBox = React.createClass({
  render: function() {
    var preview = null,
        frameSize = {
          width: this.props.dimensions.width * this.props.zoom,
          height: this.props.dimensions.height * this.props.zoom,
        };

    switch(this.props.part) {
      case 'spritesheet':
        preview = <ExportPreviewSpritesheet />
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
                    format={this.props.format} />
        break;

      case 'animation':
        preview = <ExportPreviewAnimation />
        break;
    }

    return (
      <div id="ExportPreviewBox">
        <h5>Preview</h5>
        <div ref="inner" className="inner">
          {preview}
        </div>
      </div>
    )
  },
});