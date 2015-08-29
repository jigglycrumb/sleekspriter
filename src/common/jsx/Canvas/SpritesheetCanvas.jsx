var SpritesheetCanvas = React.createClass({
  mixins: [CanvasMixin],
  render: function() {

    if(_.isUndefined(this.props.maxSize)) {
      var width = this.props.file.size.width * this.props.file.frames.x * this.props.zoom,
          height = this.props.file.size.height * this.props.file.frames.y * this.props.zoom,
          style = {
            width: width,
            height: height,
          };
    }
    else {
      var fitted = this.fitToSize(this.props.maxSize),
          width = fitted.size.width,
          height = fitted.size.height,
          style = fitted.style;
    }

    return (
      <canvas width={width} height={height} style={style}></canvas>
    );
  },

  paint: function() {

    var canvas = this.getDOMNode(),
        pixels = this.props.pixels.file;

    this.clear();

    // paint
    pixels.forEach(function(px) {
      var targetPos = this.getPixelSpritesheetPosition(px),
          pixelsAbove = this.getPixelsAbove(pixels, px.x, px.y, px.z, px.frame);
      if(pixelsAbove === false) Pixel.paint(canvas, targetPos.x, targetPos.y, px.toHex(), this.props.zoom);
    }, this);
  },
  getPixelSpritesheetPosition: function(pixel) {
    var framePos = {
      x: (x = pixel.frame % this.props.file.frames.x) === 0 ? this.props.file.frames.x : x,
      y: Math.ceil(pixel.frame / this.props.file.frames.x),
    };

    var targetPos = {
      x: ((framePos.x-1) * this.props.file.size.width) + pixel.x,
      y: ((framePos.y-1) * this.props.file.size.height) + pixel.y,
    };
    return targetPos;
  },
});