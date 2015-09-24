var SpritesheetCanvas = React.createClass({
  propTypes: {
    zoom: React.PropTypes.number.isRequired, // zoom level
    file: React.PropTypes.object.isRequired, // FileStore
    pixels: React.PropTypes.object.isRequired, // PixelStore
    maxSize: React.PropTypes.number,
  },
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
        pixels = [],
        layersVisible = [];

    flux.stores.FileStore.getData().layers.forEach(function(layer) {
      layersVisible[layer.id] = layer.visible;
    }, this);

    this.props.pixels.file.forEach(function(px) {
      if(!pixels[px.z]) pixels[px.z] = [];
      pixels[px.z].push(px);
    });

    this.clear();

    // paint
    pixels.forEach(function(zLayer) {
      zLayer.forEach(function(px) {
        var targetPos = this.getPixelSpritesheetPosition(px);
        if(layersVisible[px.layer] === true) Pixel.paint(canvas, targetPos.x, targetPos.y, px.toHex(), this.props.zoom);
      }, this);
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