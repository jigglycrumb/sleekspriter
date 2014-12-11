Editor.prototype.pixels = {};

Editor.prototype.pixels.file = [];

Editor.prototype.pixels.frame = []; // make iterations faster by copying frame pixels to their own collection
                                    // also needed to show pixel count in status bar

/**
 * contains the pixels to work with
 * @type {Array}
 */
Editor.prototype.pixels.scope = [];

Editor.prototype.pixels.init = function() {
  var self = this;

  // check if a pixel is inside selection bounds
  function pixelHasBeenSelected(pixel) {
    return editor.selection.contains(pixel) && pixel.layer == editor.layers.selected;
  };

  function deletePixel(from, layer, x, y) {
    self[from] = self[from].filter(function(px) {
      return !(px.layer == layer && px.x == x && px.y == y);
    });
  };

  // message handlers
  channel.subscribe('file.load', function() {
    self.file = file.pixels;
  });

  channel.subscribe('frame.select', function(data, envelope) {
    self.frame = _.where(self.file, {frame: data.frame});
  });

  channel.subscribe('scope.set', function(data, envelope) {

    // update pixels in scope

    if(data.old !== null && self.scope.length > 0) {
      // merge scope pixels back to frame
      self.scope.forEach(function(px) {
        var oldPixel = _.findWhere(self.frame, {x: px.x, y: px.y});
        if(!_.isUndefined(oldPixel)) {
          deletePixel('frame', px.layer, px.x, px.y);
        }
        self.frame.push(px);
      });

      self.scope = [];
    }

    var layer = data.scope === 'layer' ? data.data : data.old;

    switch(data.scope) {
      case 'selection':
        // move pixels in selection to scope
        self.scope = _.remove(self.frame, function(px) {
          return px.layer === layer && editor.selection.contains(px);
        });
        break;

      case 'layer':
        // move pixels of layer to scope
        self.scope = _.remove(self.frame, {layer: layer});
        break;
    }

    self.log();
  });

  channel.subscribe('pixels.move', function(data, envelope) {
    var wrapPixel = function(px) { px.wrap(data.distance) };
    self.scope.forEach(wrapPixel);
    channel.publish('canvas.refresh', {
      frame: editor.frame.selected,
      layer: editor.layers.selected,
    });
  });

  channel.subscribe('pixel.add', function(data, envelope) {
    // add/replace pixel
    var c = new Color(data.color),
        a = 1;

    var newPixel = new Pixel(data.frame, data.layer, data.x, data.y, data.z, c.red(), c.green(), c.blue(), a);
    var oldPixel = _.findWhere(self.scope, {x: data.x, y: data.y});
    if(_.isUndefined(oldPixel)) {
      // console.log('filling pixel', data.layer, data.x, data.y, c.rgbString());
      self.scope.push(newPixel);
    }
    else {
      // console.log('replacing pixel', data.layer, data.x, data.y, c.rgbString());

      // replace old pixel
      for(var i = 0; i < self.scope.length; i++) {
        var p = self.scope[i];
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

  channel.subscribe('pixel.delete', function(data, envelope) {
    deletePixel('scope', data.layer, data.x, data.y);
    deletePixel('frame', data.layer, data.x, data.y);
    deletePixel('file', data.layer, data.x, data.y);
  });
}; // Editor.prototype.pixels.init

/**
 * Merges pixels from one array to another
 * @param  {Pixel[]} from The source pixels
 * @param  {Pixel[]} to   The destination pixels
 */
Editor.prototype.pixels.merge = function(from, to) {
  this[from].forEach(function(px) {
    this[to].push(px);
  }, this);
  this[to] = _.unique(this[to], function(px) { return px.uid() });
};

/**
 * Save updated pixels
 */
Editor.prototype.pixels.save = function() {
  console.log('saving pixels...');
  this.merge('scope', 'file');
  this.merge('frame', 'file');
  file.pixels = this.file;
  channel.publish('file.save');
  this.log();
};

Editor.prototype.pixels.log = function() {
  console.log('scope: '+this.scope.length+' '+
              'frame: '+this.frame.length+' '+
              'file: '+this.file.length);
};