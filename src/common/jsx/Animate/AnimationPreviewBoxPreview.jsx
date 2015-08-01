var AnimationPreviewBoxPreview = React.createClass({
  mixins: [FrameCanvasMixin],
  render: function() {
    var scale = 1,
        width = this.props.width*scale,
        height = this.props.height*scale;

    return (
      <canvas id="AnimationPreviewBoxPreview" width={width} height={height}></canvas>
    );
  },

  /**
   * scale the canvas to a given size
   * @param  {int} width  target width
   * @param  {int} height target height
   */
  scale: function(width, height) {
    var scale,
        canvas = this.getDOMNode();

    if(width < height) {
      // scale to width
      scale = Math.floor(width/this.props.width);
    }
    else {
      // scale to height
      scale = Math.floor(height/this.props.height);
    }

    canvas.setAttribute('width', this.props.width*scale);
    canvas.setAttribute('height', this.props.height*scale);

    this.paintFrame();
  }
});