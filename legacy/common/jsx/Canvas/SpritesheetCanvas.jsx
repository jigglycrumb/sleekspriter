var SpritesheetCanvas = React.createClass({
  propTypes: {
    zoom: React.PropTypes.number.isRequired, // zoom level
    file: React.PropTypes.object.isRequired, // FileStore
    pixels: React.PropTypes.object.isRequired, // PixelStore
    maxSize: React.PropTypes.number,
    background: React.PropTypes.string,
  },
  mixins: [CanvasMixin], // must implement paint, paintPixel, erasePixel
  render: function() {

    var width, height, style;

    if(_.isUndefined(this.props.maxSize)) {
      width = this.props.file.size.width * this.props.file.frames.x * this.props.zoom;
      height = this.props.file.size.height * this.props.file.frames.y * this.props.zoom;
      style = {
        width: width,
        height: height,
      };
    }
    else {
      var fitted = this.fitToSize(this.props.maxSize);
      width = fitted.size.width;
      height = fitted.size.height;
      style = fitted.style;
    }

    return (
      <canvas width={width} height={height} style={style}></canvas>
    );
  },

  paint: function() {

    // console.log('SpritesheetCanvas.paint');

    var canvas = ReactDOM.findDOMNode(this),
        pixels = [],
        layerDict = [];

    this.props.file.layers.forEach(function(layer) {
      layerDict[layer.id] = {visible: layer.visible, opacity: layer.opacity};
    }, this);

    // sort pixels via z value
    var dict = this.props.pixels.dict,
        flen, llen, xlen, ylen,
        frames, f, frame,
        layers, l, layer,
        xValues, x, xValue,
        yValues, y, yValue,
        pixel;

    frames = Object.keys(dict);
    flen = frames.length;

    for(f = 0; f < flen; f++) {
      frame = frames[f];

      layers = Object.keys(dict[frame]);
      llen = layers.length;

      for(l = 0; l < llen; l++) {
        layer = layers[l];

        xValues = Object.keys(dict[frame][layer]);
        xlen = xValues.length;

        for(x = 0; x < xlen; x++) {
          xValue = xValues[x];

          yValues = Object.keys(dict[frame][layer][xValue]);
          ylen = yValues.length;

          for(y = 0; y < ylen; y++) {
            yValue = yValues[y];
            pixel = dict[frame][layer][xValue][yValue].clone();

            if(!pixels[pixel.z]) pixels[pixel.z] = [];
            pixels[pixel.z].push(pixel);
          }
        }
      }
    }

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

    // console.log('SpritesheetCanvas.paintPixel');

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

    // console.log('SpritesheetCanvas.erasePixel');

    var payload = stateHistory.last.payload,
        canvas = ReactDOM.findDOMNode(this);

    // get all pixels at coordinate
    var pixels = [],
        scope = this.props.pixels.dict[payload.frame],
        layers = Object.keys(scope),
        pixel;

    layers.forEach(function(layer) {
      try {
        pixel = scope[layer][payload.x][payload.y];
        pixels[pixel.z] = pixel;
      } catch(e) {}
    });

    if(pixels.length === 0) {
      Pixel.clear(canvas, payload.x, payload.y);
    }
    else {
      pixel = pixels.pop();
      var targetPos = this.getPixelSpritesheetPosition(pixel),
          alpha;
      if(this.props.noAlpha) alpha = 1;
      else alpha = pixel.a * (storeUtils.layers.getById(pixel.layer).opacity / 100);
      Pixel.paint(canvas, targetPos.x, targetPos.y, pixel.toHex(), alpha, this.props.zoom);
    }
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
