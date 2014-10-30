var Editor = function() {

  var self = this;

  this.offset = {
    top: 40,
    right: 205,
    bottom: 27,
    left: 45,
  };

  this.settingsVisible = false;

  channel.subscribe('stage.settings.toggle', function(data, envelope) {
    self.settingsVisible = data.visible;
  });

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
  this.cursor.init();
  this.color.init();
  this.background.init();
  this.tool.init();

  channel.subscribe('stage.tool.paintbucket', function(data, envelope) {
    var initialPixel = _.findWhere(self.pixels.scope, {x: data.point.x, y: data.point.y}),
        initialColor,
        fillColor = self.color.brush;

    if(_.isUndefined(initialPixel)) { // check if initial pixel is transparent
      initialPixel = {frame: self.frame.selected, layer: self.layer, x: data.point.x, y: data.point.y, r: 0, g: 0, b: 0, a: 0};
    }

    initialColor = new Color({r: initialPixel.r, g: initialPixel.g, b: initialPixel.b});
    initialColor.alpha(initialPixel.a);

    var filled = [];

    function rFill(point) {

      filled.push(point);

      var pixel = _.findWhere(self.pixels.scope, {x: point.x, y: point.y}),
          pixelColor,
          neighbors;

      if(_.isUndefined(pixel)) {
        pixelColor = new Color().rgb(0, 0, 0);
        pixelColor.alpha(0);
      }
      else pixelColor = new Color().rgb(pixel.r, pixel.g, pixel.b);

      if(pixelColor.rgbString() == initialColor.rgbString()) {
        Pixel.add(self.frame.selected, self.layers.selected, point.x, point.y, file.getLayerById(self.layers.selected).z, fillColor.hexString());

        neighbors = getAdjacentPixels(point);
        neighbors.forEach(function(n) {
          var old = _.findWhere(filled, {x: n.x, y: n.y});
          if(_.isUndefined(old)) rFill(n);
        });
      }
    }

    rFill(initialPixel);
  });
};

Editor.prototype = {};
Editor.prototype.constructor = Editor;