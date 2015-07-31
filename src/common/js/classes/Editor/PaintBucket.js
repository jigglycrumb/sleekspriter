Editor.prototype.paintBucket = {};

Editor.prototype.paintBucket.init = function() {
  var self = this;

  channel.gui.subscribe('stage.tool.paintbucket', function(data, envelope) {
    self.fill(data.point);
  });
};

Editor.prototype.paintBucket.fill = function(point) {

  // get the pixel the paint bucket was used on
  var initialPixel = _.findWhere(editor.pixels.scope, {x: point.x, y: point.y});
  // color object for the first pixels color
  var initialColor;
  // the new pixel color
  fillColor = flux.stores.UiStore.getData().color.brush;

  // check if initial pixel already exists
  if(_.isUndefined(initialPixel)) {
    // pixel doesn't exist yet, create new transparent one
    initialPixel = {
      frame: editor.frames.selected,
      layer: editor.layers.selected,
      x: point.x,
      y: point.y,
      r: 0,
      g: 0,
      b: 0,
      a: 0
    };
  }

  // create color object from initial pixel
  initialColor = new Color({r: initialPixel.r, g: initialPixel.g, b: initialPixel.b});
  // set inital pixel transparency
  initialColor.alpha(initialPixel.a);

  // array for already filled pixels
  var filled = [];

  // start recursively filling the pixels
  rFill(initialPixel);


  // helper function to get neighbors of a pixel
  function getAdjacentPixels(point) {

    var p, // helper point
        arr = [], // array for found neighbors
        bounds = { // set default search bounds to file size
          top: 1,
          right: file.size.width,
          bottom: file.size.height,
          left: 1,
        };

    // restrict bounds to selection if active
    if(editor.selection.isActive) {
      bounds = {
        top: editor.selection.bounds.start.y,
        right: editor.selection.bounds.end.x,
        bottom: editor.selection.bounds.end.y,
        left: editor.selection.bounds.start.x,
      };
    }

    // get top neighbor
    p = new Point(point.x, point.y-1);
    if(p.y >= bounds.top) arr.push(p);
    // get right neighbor
    p = new Point(point.x+1, point.y);
    if(p.x <= bounds.right) arr.push(p);
    // get bottom neighbor
    p = new Point(point.x, point.y+1);
    if(p.y <= bounds.bottom) arr.push(p);
    // get left neighbor
    p = new Point(point.x-1, point.y);
    if(p.x >= bounds.left) arr.push(p);

    return arr;
  };

  // function to recursively fill the pixels
  function rFill(point) {

    // push pixel to filled array
    filled.push(point);

    var pixel = _.findWhere(editor.pixels.scope, {x: point.x, y: point.y}),
        pixelColor,
        neighbors;

    if(_.isUndefined(pixel)) {
      pixelColor = new Color().rgb(0, 0, 0);
      pixelColor.alpha(0);
    }
    else pixelColor = new Color().rgb(pixel.r, pixel.g, pixel.b);

    if(pixelColor.rgbString() === initialColor.rgbString()) {
      Pixel.add(editor.frames.selected, editor.layers.selected, point.x, point.y, file.getLayerById(editor.layers.selected).z, fillColor.hexString());

      neighbors = getAdjacentPixels(point);
      neighbors.forEach(function(n) {
        var old = _.findWhere(filled, {x: n.x, y: n.y});
        if(_.isUndefined(old)) rFill(n);
      });
    }
  }
};