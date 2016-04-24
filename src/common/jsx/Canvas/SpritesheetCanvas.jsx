var SpritesheetCanvas = React.createClass({
  propTypes: {
    zoom: React.PropTypes.number.isRequired, // zoom level
    file: React.PropTypes.object.isRequired, // FileStore
    pixels: React.PropTypes.object.isRequired, // PixelStore
    maxSize: React.PropTypes.number,
    background: React.PropTypes.string,
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

    var canvas = ReactDOM.findDOMNode(this),
        pixels = [],
        layerDict = [];

    flux.stores.FileStore.getData().layers.forEach(function(layer) {
      layerDict[layer.id] = {visible: layer.visible, opacity: layer.opacity};
    }, this);

    this.props.pixels.file.forEach(function(px) {
      if(!pixels[px.z]) pixels[px.z] = [];
      pixels[px.z].push(px);
    });

    this.clear();

    if(this.props.background) {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = this.props.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // paint
    pixels.forEach(function(zLayer) {
      zLayer.forEach(function(px) {
        if(layerDict[px.layer].visible === true) {
          var targetPos = this.getPixelSpritesheetPosition(px),
              alpha = px.a * (layerDict[px.layer].opacity / 100);
          Pixel.paint(canvas, targetPos.x, targetPos.y, px.toHex(), alpha, this.props.zoom);
        }
      }, this);
    }, this);
  },

  paintPixel: function() {
    var layerDict = [],
        px = stateHistory.last.payload,
        canvas = ReactDOM.findDOMNode(this);

    flux.stores.FileStore.getData().layers.forEach(function(layer) {
      layerDict[layer.id] = {visible: layer.visible, opacity: layer.opacity};
    }, this);

    if(layerDict[px.layer].visible === true) {
      var targetPos = this.getPixelSpritesheetPosition(px),
          alpha = px.a * (layerDict[px.layer].opacity / 100);
      Pixel.paint(canvas, targetPos.x, targetPos.y, px.color, alpha, this.props.zoom);
    }
  },

  erasePixel: function() {
    // console.log(stateHistory.last.payload);
    this.paint(); // TODO implement a better method instead of repainting everything
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
