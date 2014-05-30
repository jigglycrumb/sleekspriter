/** @jsx React.DOM */
var PreviewBoxPreview = React.createClass({
  mixins: [CopyFrameMixin],
  propTypes: {
     frame: React.PropTypes.number.isRequired,  // frame id, required for CopyFrameMixin
     width: React.PropTypes.number.isRequired, // file width
     height: React.PropTypes.number.isRequired, // file height
  },
  render: function() {

    var scale = 1,
        maxWidth = 160,
        maxHeight = 90;

    if(this.props.width > this.props.height) {
      // scale to width
      scale = maxWidth/this.props.width;
    }
    else {
      // scale to height
      scale = maxHeight/this.props.height;
    }

    var width = this.props.width*scale,
        height = this.props.height*scale;

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