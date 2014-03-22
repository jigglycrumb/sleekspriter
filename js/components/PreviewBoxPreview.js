var PreviewBoxPreview = React.createClass({
  mixins: [CopyFrameMixin],
  render: function() {

    var scale = 1,
        maxWidth = 160,
        maxHeight = 90;

    if(this.props.file.size.width > this.props.file.size.height) {
      // scale to width
      scale = maxWidth/this.props.file.size.width;
    }
    else {
      // scale to height
      scale = maxHeight/this.props.file.size.height;
    }

    var cssWidth = this.props.file.size.width*scale,
        cssHeight = this.props.file.size.height*scale;

    return (
      <canvas
        id="PreviewBoxPreview"
        width={this.props.file.size.width*this.props.editor.zoom}
        height={this.props.file.size.height*this.props.editor.zoom}
        style={{
          width: cssWidth,
          height: cssHeight,
        }}>
      </canvas>
    );
  }
});