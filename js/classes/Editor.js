var Editor = function(signal) {

  var maxZoom = 50,
      minZoom = 1,
      self = this;

  this.frame = 1;
  this.lastFrame = 1;

  this.layer = null;

  this.selectTopLayer = function() {
    var frameLayers = _.where(file.layers, {frame: this.frame});
    var topLayer = _.max(frameLayers, function(layer) { return layer.z; });
    signal.layerSelected.dispatch(topLayer.id);
  }

  this.zoom = 10;
  this.grid = true;
  this.pixel = new Point(0, 0);
  this.pixelColor = Color('#000000');
  this.layerPixelColor = Color('#000000');
  this.tool = 'BrushTool';
  this.color = Color('#000000');

  this.brightnessToolMode = 'lighten';
  this.brightnessToolIntensity = 10;

  this.offset = {
    top: 40,
    right: 205,
    bottom: 27,
    left: 45,
  };


  this.pixels = []; // contains all pixels of the selected frame

  this.deletePixel = function(layer, x, y) {
    this.pixels = this.pixels.filter(function(pixel) {
      return !(pixel.layer == layer && pixel.x == x && pixel.y == y);
    });
  };

  var getFramePixels = function() {
    var frameLayers = _.where(file.layers, {frame: self.frame});
    var pixels = [];

    frameLayers.forEach(function(layer) {
      var layerPixels = _.where(file.pixels, {layer: layer.id});
      pixels.push(layerPixels);
    });

    return _.flatten(pixels);
  };

  var getAdjacentPixels = function(point) {

    var p,
        arr = [],
        bounds = {
          top: 1,
          right: file.size.width,
          bottom: file.size.height,
          left: 1,
        };

    if(self.selection.isActive) {
      bounds = {
        top: self.selection.start.y,
        right: self.selection.end.x,
        bottom: self.selection.end.y,
        left: self.selection.start.x,
      };
    }

    // top
    p = new Point(point.x, point.y-1);
    if(p.y >= bounds.top) arr.push(p);
    // right
    p = new Point(point.x+1, point.y);
    if(p.x <= bounds.right) arr.push(p);
    // bottom
    p = new Point(point.x, point.y+1);
    if(p.y <= bounds.bottom) arr.push(p);
    // left
    p = new Point(point.x-1, point.y);
    if(p.x >= bounds.left) arr.push(p);

    //console.log('found '+arr.length+' neighbors', arr);

    return arr;
  };

  this.saveChanges = function() {
    //console.log('saving changes');

    // grab all old pixels of current frame
    var frameLayers = _.pluck(this.pixels, 'layer');
    var pixels = this.pixels.slice(0); // slice clones the array
    file.pixels.forEach(function(pixel) {
      if(!inArray(frameLayers, pixel.layer)) pixels.push(pixel);
    });

    file.pixels = _.unique(pixels, function(p) { return p.layer+','+p.x+','+p.y });
    this.pixels = getFramePixels();
  };


  // signal handlers
  signal.frameSelected.add(function(frame) {
    self.saveChanges();
    self.frame = parseInt(frame);
    self.selectTopLayer();
    self.pixels = getFramePixels();
  });

  signal.layerSelected.add(function(id) {
    self.layer = id;
  });

  signal.toolSelected.add(function(tool) {
    self.tool = tool;
  });

  signal.colorSelected.add(function(color) {
    self.color = Color(color);
  });

  signal.zoomChanged.add(function(zoom) {
    self.zoom = parseInt(zoom) || self.zoom;
    self.zoom = self.zoom > maxZoom ? maxZoom : self.zoom;
    self.zoom = self.zoom < minZoom ? minZoom : self.zoom;
  });

  signal.pixelSelected.add(function(point) {
    self.pixel = point;
  });

  signal.pixelFilled.add(function(layer, x, y, color) {

    // update sprite palette
    self.palettes.sprite.colors.push(color.hexString());
    self.palettes.sprite.colors = _.uniq(self.palettes.sprite.colors, false);

    // add/replace pixel
    var c = color.rgb(),
        a = 1;

    var newPixel = new Pixel(layer, x, y, c.r, c.g, c.b, a);
    var oldPixel = _.findWhere(self.pixels, {layer: layer, x: x, y: y});
    if(_.isUndefined(oldPixel)) {
      //console.log('filling pixel', layer, x, y, color.rgbString());
      self.pixels.push(newPixel);
    }
    else {
      //console.log('replacing pixel', layer, x, y, color.rgbString());
      // replace old pixel
      for(var i = 0; i < self.pixels.length; i++) {
        var p = self.pixels[i];
        if(p.layer == layer && p.x == x && p.y == y) {
          p.r = c.r;
          p.g = c.g;
          p.b = c.b;
          p.a = a;
          break;
        }
      }
    }

    self.saveChanges(); // TODO: check if call can be removed

    signal.layerContentChanged.dispatch(layer);
  });

  signal.pixelCleared.add(function(layer, x, y) {
    self.buildAutoPalette();
    self.deletePixel(layer, x, y);
    signal.layerContentChanged.dispatch(layer);
  });

  signal.gridToggled.add(function(grid) {
    self.grid = grid;
  });

  signal.brightnessToolIntensityChanged.add(function(intensity) {
    self.brightnessToolIntensity = intensity;
  });

  signal.brightnessToolModeChanged.add(function(mode) {
    self.brightnessToolMode = mode;
  });

  signal.paletteSelected.add(function(palette) {
    self.palette = palette;
  });

  signal.pixelsMoved.add(function(distance) {

    if(self.selection.isActive) {
      self.selection.pixels.forEach(function(pixel) {
        //if(pixel.layer == self.layer && self.selection.contains(pixel)) {
          var target = wrapPixel(pixel, distance);
          pixel.x = target.x;
          pixel.y = target.y;
        //}
      });
    }
    else {
      self.pixels.forEach(function(pixel) {
        if(pixel.layer == self.layer) {
          var target = wrapPixel(pixel, distance);
          pixel.x = target.x;
          pixel.y = target.y;
        }
      });
    }

    self.saveChanges();
  });

  signal.bucketUsed.add(function(point) {

    var initialPixel = _.findWhere(self.pixels, {x: point.x, y: point.y, layer: self.layer}),
        initialColor,
        fillColor = self.color;

    if(_.isUndefined(initialPixel)) { // check if initial pixel is transparent
      initialPixel = {layer: self.layer, x: point.x, y: point.y, r: 0, g: 0, b: 0, a: 0};
    }

    initialColor = new Color({r: initialPixel.r, g: initialPixel.g, b: initialPixel.b});
    initialColor.alpha(initialPixel.a);

    var filled = [];

    function rFill(point) {

      filled.push(point);

      var pixel = _.findWhere(self.pixels, {layer: self.layer, x: point.x, y: point.y}),
          pixelColor,
          neighbors;

      if(_.isUndefined(pixel)) {
        pixelColor = new Color().rgb(0, 0, 0);
        pixelColor.alpha(0);
      }
      else pixelColor = new Color().rgb(pixel.r, pixel.g, pixel.b);

      if(pixelColor.rgbString() == initialColor.rgbString()) {
        stage.pixel.fill(self.layer, point.x, point.y, fillColor, true);
        neighbors = getAdjacentPixels(point);
        neighbors.forEach(function(n) {
          var old = _.findWhere(filled, {x: n.x, y: n.y});
          if(_.isUndefined(old)) rFill(n);
        });
      }
    }

    rFill(initialPixel);
  });

  this.selection.init(this, signal);
};

Editor.prototype = {}; //Object.create(null);
Editor.prototype.constructor = Editor;