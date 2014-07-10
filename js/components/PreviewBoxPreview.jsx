/** @jsx React.DOM */
var PreviewBoxPreview = React.createClass({
  mixins: [ResetStateMixin, PostalSubscriptionMixin, FrameCanvasMixin],
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

    scale = Math.floor(scale);

    var width = this.props.width*scale,
        height = this.props.height*scale;

    return (
      <canvas
        id="PreviewBoxPreview"
        width={width}
        height={height}
      ></canvas>
    );
  }
});