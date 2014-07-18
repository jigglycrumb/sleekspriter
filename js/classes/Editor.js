var Editor = function() {

  var self = this;

  this.pixel = new Point(0, 0);
  this.pixelColor = Color('#000000');
  this.layerPixelColor = Color('#000000');
  this.tool = 'BrushTool';
  this.color = Color('#000000');

  this.offset = {
    top: 40,
    right: 205,
    bottom: 27,
    left: 45,
  };

  this.deletePixel = function(layer, x, y) {
    this.pixels = this.pixels.filter(function(pixel) {
      return !(pixel.layer == layer && pixel.x == x && pixel.y == y);
    });
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
    console.log('saving changes to file');

    return;

    // grab all old pixels of current frame
    var frameLayers = this.layers.getIds();
    var pixels = this.pixels.frame.slice(0); // slice clones the array
    file.pixels.forEach(function(pixel) {
      if(!inArray(frameLayers, pixel.layer)) pixels.push(pixel);
    });

    file.pixels = _.unique(pixels, function(p) { return p.layer+','+p.x+','+p.y });
  };


  // init subclasses
  this.file.init();
  this.frame.init();
  this.layers.init();
  this.pixels.init();
  this.selection.init(this);
  this.brightnessTool.init();
  this.palettes.init();
  this.zoom.init();
  this.grid.init();

  channel.subscribe('app.tool.select', function(data, envelope) {
    self.tool = data.tool;
  });

  channel.subscribe('app.color.select', function(data, envelope) {
    self.color = new Color(data.color);
  });

  channel.subscribe('app.pixel.select', function(data, envelope) {
    self.pixel = data.point;
  });

  channel.subscribe('stage.pixel.clear', function(data, envelope) {
    self.palettes.buildAuto();
    self.deletePixel(data.layer, data.x, data.y);
    channel.publish('stage.layer.update', {layer: data.layer});
  });

  channel.subscribe('stage.pixel.fill', function(data, envelope) {
    // update sprite palette
    self.palettes.available.sprite.colors.push(data.color);
    self.palettes.available.sprite.colors = _.uniq(self.palettes.available.sprite.colors, false);

    // add/replace pixel
    var c = new Color(data.color),
        a = 1;

    var newPixel = new Pixel(data.frame, data.layer, data.x, data.y, data.z, c.red(), c.green(), c.blue(), a);
    var oldPixel = _.findWhere(self.pixels.layer, {x: data.x, y: data.y});
    if(_.isUndefined(oldPixel)) {
      //console.log('filling pixel', data.layer, data.x, data.y, c.rgbString());
      self.pixels.layer.push(newPixel);
    }
    else {
      //console.log('replacing pixel', data.layer, data.x, data.y, c.rgbString());
      // replace old pixel
      for(var i = 0; i < self.pixels.layer.length; i++) {
        var p = self.pixels.layer[i];
        if(p.x == data.x && p.y == data.y) {
          p.r = c.red();
          p.g = c.green();
          p.b = c.blue();
          p.a = a;
          break;
        }
      }
    }

    self.saveChanges(); // TODO: check if call can be removed
  });


  channel.subscribe('stage.tool.paintbucket', function(data, envelope) {
    var initialPixel = _.findWhere(self.pixels.layer, {x: data.point.x, y: data.point.y}),
        initialColor,
        fillColor = self.color;

    if(_.isUndefined(initialPixel)) { // check if initial pixel is transparent
      initialPixel = {frame: self.frame.selected, layer: self.layer, x: data.point.x, y: data.point.y, r: 0, g: 0, b: 0, a: 0};
    }

    initialColor = new Color({r: initialPixel.r, g: initialPixel.g, b: initialPixel.b});
    initialColor.alpha(initialPixel.a);

    var filled = [];

    function rFill(point) {

      filled.push(point);

      var pixel = _.findWhere(self.pixels.layer, {x: point.x, y: point.y}),
          pixelColor,
          neighbors;

      if(_.isUndefined(pixel)) {
        pixelColor = new Color().rgb(0, 0, 0);
        pixelColor.alpha(0);
      }
      else pixelColor = new Color().rgb(pixel.r, pixel.g, pixel.b);

      if(pixelColor.rgbString() == initialColor.rgbString()) {
        Pixel.publish(self.frame.selected, self.layers.selected, point.x, point.y, file.getLayerById(self.layers.selected).z, fillColor.hexString());

        neighbors = getAdjacentPixels(point);
        neighbors.forEach(function(n) {
          var old = _.findWhere(filled, {x: n.x, y: n.y});
          if(_.isUndefined(old)) rFill(n);
        });
      }
    }

    rFill(initialPixel);
  });

  channel.subscribe('stage.tool.move', function(data, envelope) {
    if(self.selection.isActive) {
      self.selection.pixels.forEach(function(pixel) {
        var target = wrapPixel(pixel, data.distance);
        pixel.x = target.x;
        pixel.y = target.y;
      });
    }
    else {
      self.pixels.forEach(function(pixel) {
        if(pixel.layer == self.layer) {
          var target = wrapPixel(pixel, data.distance);
          pixel.x = target.x;
          pixel.y = target.y;
        }
      });
    }

    self.saveChanges();
  });


};

Editor.prototype = {};
Editor.prototype.constructor = Editor;