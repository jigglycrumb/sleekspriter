var LayerCanvas = React.createClass({
  propTypes: {
    layer: React.PropTypes.number, // layer id
    zoom: React.PropTypes.number.isRequired, // zoom level
    file: React.PropTypes.object.isRequired, // FileStore
    pixels: React.PropTypes.object.isRequired, // PixelStore
    maxSize: React.PropTypes.number,
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
    if(this.isMounted()) { // needed because of the setTimeout
                           // or removed layers after size.set will throw
                           // an Invariant Violation

      this.clear();

      var canvas = ReactDOM.findDOMNode(this);
          // var paint = function(px) {
          //   if(px.layer === this.props.layer) {
          //     Pixel.paint(canvas, px.x, px.y, px.toHex());
          //   }
          // };

      // paint
      var x, y;
      var frame = storeUtils.frames.getSelected();

      try {
        var scope = this.props.pixels.dict[frame][this.props.layer];

        for(x in scope) {
          for(y in scope) {
            var px = scope[x][y];
            Pixel.paint(canvas, px.x, px.y, px.toHex());
          }
        }
      } catch(e) {}


      //
      // if(this.props.pixels.preview.length > 0) {
      //   this.props.pixels.preview.forEach(paint, this);
      // }
      // else {
      //   this.props.pixels.scope.forEach(paint, this);
      //   this.props.pixels.frame.forEach(paint, this);
      // }
    }
  },

  paintPixel: function(pixel) {
    var px = pixel || stateHistory.last.payload,
        canvas = ReactDOM.findDOMNode(this);

    // console.log('paintPixel', px);

    if(px.layer === this.props.layer) {
      Pixel.paint(canvas, px.x, px.y, px.color); // px.color == hex string
    }
  },

  erasePixel: function() {
    var px = stateHistory.last.payload,
        canvas = ReactDOM.findDOMNode(this);

    if(px.layer === this.props.layer) {
      Pixel.clear(canvas, px.x, px.y);
    }
  },
  // previewLayer: function(pixels) {

  //   this.clear();

  //   var canvas = ReactDOM.findDOMNode(this),
  //       pixels = [];

  //   // paint
  //   pixels.forEach(function(px) {
  //     if(px.layer === this.props.layer) {
  //       Pixel.paint(canvas, px.x, px.y, px.toHex());
  //     }
  //   }, this);
  // },
});
