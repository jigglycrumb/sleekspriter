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

    var width = this.props.file.size.width*scale,
        height = this.props.file.size.height*scale;

    return (
      <canvas
        id="PreviewBoxPreview"
        width={width}
        height={height}
        style={{
          width: width,
          height: height,
        }}>
      </canvas>
    );
  }
});