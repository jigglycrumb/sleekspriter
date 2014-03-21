var PreviewBoxPreview = React.createClass({
  mixins: [CopyFrameMixin],
  render: function() {

    var scale = 1,
        maxWidth = 160,
        maxHeight = 90;

    if(this.props.io.size.width > this.props.io.size.height) {
      // scale to width
      scale = maxWidth/this.props.io.size.width;
    }
    else {
      // scale to height
      scale = maxHeight/this.props.io.size.height;
    }

    var cssWidth = this.props.io.size.width*scale,
        cssHeight = this.props.io.size.height*scale;

    return (
      <canvas
        id="PreviewBoxPreview"
        width={this.props.io.size.width*this.props.editor.zoom}
        height={this.props.io.size.height*this.props.editor.zoom}
        style={{
          width: cssWidth,
          height: cssHeight,
        }}>
      </canvas>
    );
  }
});