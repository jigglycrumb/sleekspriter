/** @jsx React.DOM */
var PreviewBoxPreview = React.createClass({
  mixins: [CopyFrameMixin],
  render: function() {

    var scale = 1,
        maxWidth = 160,
        maxHeight = 90;

    if(this.props.size.width > this.props.size.height) {
      // scale to width
      scale = maxWidth/this.props.size.width;
    }
    else {
      // scale to height
      scale = maxHeight/this.props.size.height;
    }

    var width = this.props.size.width*scale,
        height = this.props.size.height*scale;

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