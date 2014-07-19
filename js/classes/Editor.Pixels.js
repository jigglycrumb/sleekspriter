Editor.prototype.pixels = {};
Editor.prototype.pixels.selected = null;
Editor.prototype.pixels.layer = [];
Editor.prototype.pixels.frame = [];
Editor.prototype.pixels.selection = [];

Editor.prototype.pixels.init = function() {
  var self = this;

  // merges selection to layer and clears selection
  function saveAndClearSelection() {
    self.selection.forEach(function(pixel) {
      self.layer.push(pixel);
    });

    self.layer = _.unique(self.layer, function(p) { return p.layer+','+p.x+','+p.y });
    self.selection = [];
  };

  // check if a pixel is inside selection bounds
  function pixelHasBeenSelected(pixel) {
    return editor.selection.contains(pixel) && pixel.layer == editor.layers.selected;
  };

  function deletePixel(layer, x, y) {
    self.layer = self.layer.filter(function(px) {
      return !(px.layer == layer && px.x == x && px.y == y);
    });


    // TODO: save changes
  };






  // message handlers

  channel.subscribe('stage.pixel.fill', function(data, envelope) {
    // add/replace pixel
    var c = new Color(data.color),
        a = 1;

    var newPixel = new Pixel(data.frame, data.layer, data.x, data.y, data.z, c.red(), c.green(), c.blue(), a);
    var oldPixel = _.findWhere(self.layer, {x: data.x, y: data.y});
    if(_.isUndefined(oldPixel)) {
      //console.log('filling pixel', data.layer, data.x, data.y, c.rgbString());
      self.layer.push(newPixel);
    }
    else {
      //console.log('replacing pixel', data.layer, data.x, data.y, c.rgbString());
      // replace old pixel
      for(var i = 0; i < self.layer.length; i++) {
        var p = self.layer[i];
        if(p.x == data.x && p.y == data.y) {
          p.r = c.red();
          p.g = c.green();
          p.b = c.blue();
          p.a = a;
          break;
        }
      }
    }
  });

  channel.subscribe('stage.pixel.clear', function(data, envelope) {
    deletePixel(data.layer, data.x, data.y);
  });

  channel.subscribe('app.frame.select', function(data, envelope) {
    self.frame = _.where(file.pixels, {frame: data.frame});
  });

  channel.subscribe('app.layer.select', function(data, envelope) {
    self.layer = _.where(self.frame, {layer: data.layer});
  });

  channel.subscribe('app.tool.select', function(data, envelope) {
    if(editor.selection.isActive) {
      switch(data.tool) {
        case 'RectangularSelectionTool':
          saveAndClearSelection();
          break;
        default:
          // move selected pixels from layer to selection
          self.selection = _.filter(self.layer, pixelHasBeenSelected);
          self.layer = _.reject(self.layer, pixelHasBeenSelected);
          break;
      }
    }
  });

  channel.subscribe('stage.tool.move', function(data, envelope) {
    var wrapPixel = function(px) { px.wrap(data.distance) };
    if(editor.selection.isActive) self.selection.forEach(wrapPixel);
    else self.layer.forEach(wrapPixel);
  });

  channel.subscribe('stage.selection.move.pixels', function(data, envelope) {
    self.selection.forEach(function(p) {
      p.x += data.distance.x;
      p.y += data.distance.y;
    });
  });

  channel.subscribe('stage.selection.clear', saveAndClearSelection);
};