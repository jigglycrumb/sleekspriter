var FrameCanvas = React.createClass({
  propTypes: {
    frame: React.PropTypes.number, // frame id
    zoom: React.PropTypes.number, // zoom level
    file: React.PropTypes.object.isRequired, // FileStore
    pixels: React.PropTypes.object.isRequired, // PixelStore
    maxSize: React.PropTypes.number,
  },
  mixins: [CanvasMixin],
  render: function() {

    if(_.isUndefined(this.props.maxSize)) {
      var width = this.props.file.size.width*this.props.zoom,
          height = this.props.file.size.height*this.props.zoom,
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
      if(layer.frame === this.props.frame) layersVisible[layer.id] = layer.visible;
    }, this);

    // collect frame pixels
    function grab(px) {
      if(px.frame === this.props.frame) pixels.push(px);
    }

    this.props.pixels.file.forEach(grab, this);
    this.props.pixels.scope.forEach(grab, this);

    this.clear();

    // if(this.props.backgroundColor && this.props.backgroundColor !== 'transparent') {
    //   var ctx = canvas.getContext('2d');
    //   ctx.fillStyle = this.props.backgroundColor;
    //   ctx.fillRect(0, 0, canvas.width, canvas.height);
    // }

    // paint
    // TODO: pixels below don't get drawn, fix that.
    pixels.forEach(function(px) {
      var pixelsAbove = this.getPixelsAbove(pixels, px.x, px.y, px.z);
      if(layersVisible[px.layer] === true && pixelsAbove === false) Pixel.paint(canvas, px.x, px.y, px.toHex());
    }, this);
  },

  // previewFrame: function(pixels) {
  //   var canvas = this.getDOMNode();

  //   this.props.ui.pixels.frame.forEach(function(px) {
  //     if(px.layer !== this.state.data.layer) pixels.push(px);
  //   }, this);

  //   this.clear();

  //   if(this.props.backgroundColor && this.props.backgroundColor !== 'transparent') {
  //     var ctx = canvas.getContext('2d');
  //     ctx.fillStyle = this.props.backgroundColor;
  //     ctx.fillRect(0, 0, canvas.width, canvas.height);
  //   }

  //   // paint
  //   pixels.forEach(function(px) {
  //     var pixelsAbove = this.getPixelsAbove(pixels, px.x, px.y, px.z);
  //     if(pixelsAbove === false) Pixel.paint(canvas, px.x, px.y, px.toHex());
  //   }, this);
  // },

});