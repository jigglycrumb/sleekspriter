var FrameCanvas = React.createClass({
  propTypes: {
    frame: React.PropTypes.number, // frame id
    zoom: React.PropTypes.number, // zoom level
    file: React.PropTypes.object.isRequired, // FileStore
    pixels: React.PropTypes.object.isRequired, // PixelStore
    maxSize: React.PropTypes.number,
    noAlpha: React.PropTypes.bool,
    noMargin: React.PropTypes.bool,
    background: React.PropTypes.string,
  },
  mixins: [CanvasMixin], // must implement paint, paintPixel, erasePixel
  render: function() {

    var width, height, style;

    if(_.isUndefined(this.props.maxSize)) {
      width = this.props.file.size.width*this.props.zoom;
      height = this.props.file.size.height*this.props.zoom;
      style = {
        width: width,
        height: height,
      };
    }
    else {
      var noMargin = this.props.noMargin ? true : false,
          fitted = this.fitToSize(this.props.maxSize, noMargin);
      width = fitted.size.width;
      height = fitted.size.height;
      style = fitted.style;
    }

    return (
      <canvas width={width} height={height} style={style}></canvas>
    );
  },
  componentDidUpdate: function(prevProps) {
    if(this.props.frame !== prevProps.frame) {
      this.clear();
      this.paint();
    }
  },
  paint: function() {

    this.guard();

    // console.log('FrameCanvas.paint');

    var canvas = ReactDOM.findDOMNode(this),
        pixels = [],
        layerDict = {};

    this.props.file.layers.forEach(function(layer) {
      if(layer.frame === this.props.frame) layerDict[layer.id] = {visible: layer.visible, opacity: layer.opacity};
    }, this);

    // collect frame pixels and sort them by z value
    var layer, x, y;

    try {
      var scope = this.props.pixels.dict[this.props.frame],
          layers = Object.keys(scope);

      var xValues, yValues;

      layers.forEach(function(layer) {
        xValues = Object.keys(scope[layer]);
        xValues.forEach(function(x) {

          yValues = Object.keys(scope[layer][x]);
          yValues.forEach(function(y) {
            var px = scope[layer][x][y];
            if(!pixels[px.z]) pixels[px.z] = [];
            pixels[px.z].push(px);
          });
        });
      });
    } catch(e) {}

    // if(this.props.pixels.preview.length > 0) {
    //   this.props.pixels.preview.forEach(grab, this);
    // }

    this.clear();

    if(this.props.background) {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = this.props.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    pixels.forEach(function(zLayer) {
      zLayer.forEach(function(px) {
        if(layerDict[px.layer].visible === true) {
          var alpha;
          if(this.props.noAlpha) alpha = 1;
          else alpha = px.a * (layerDict[px.layer].opacity / 100);
          Pixel.paint(canvas, px.x, px.y, px.toHex(), alpha);
        }
      }, this);
    }, this);
  },

  paintPixel: function() {

    this.guard();

    // console.log('FrameCanvas.paintPixel');

    var layerDict = [],
        px = stateHistory.last.payload,
        canvas = ReactDOM.findDOMNode(this);

    if(px.frame === this.props.frame) {

      this.props.file.layers.forEach(function(layer) {
        if(layer.frame === this.props.frame) layerDict[layer.id] = {visible: layer.visible, opacity: layer.opacity};
      }, this);

      if(layerDict[px.layer].visible === true) {
        var alpha;
        if(this.props.noAlpha) alpha = 1;
        else alpha = px.a * (layerDict[px.layer].opacity / 100);
        Pixel.paint(canvas, px.x, px.y, px.color, alpha);
      }
    }
  },

  erasePixel: function() {

    this.guard();

    // console.log('FrameCanvas.erasePixel');

    // console.log(stateHistory.last.payload);
    this.paint(); // TODO implement a better method instead of repainting everything
  },

  guard: function() {
    if(storeUtils.frames.getSelected() != this.props.frame) return;
  },
});
