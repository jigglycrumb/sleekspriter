Editor.prototype.pixels = {};

/**
 * contains a copy of all pixels of the loaded file
 * @type {Array}
 */
Editor.prototype.pixels.file = [];

/**
 * contains all pixels of the current frame
 * was introduced to make iterations faster
 * also needed to show pixel count in menu bar
 * @type {Array}
 */
Editor.prototype.pixels.frame = [];

/**
 * contains the pixels to work with
 * @type {Array}
 */
Editor.prototype.pixels.scope = [];

/**
 * contains the clipboard pixels
 * @type {Array}
 */
Editor.prototype.pixels.clipboard = [];

Editor.prototype.pixels.init = function() {
  var self = this;

  // check if a pixel is inside selection bounds
  function pixelHasBeenSelected(pixel) {
    return storeUtils.selection.contains(pixel) && pixel.layer == flux.stores.UiStore.getData().layer.selected;
  };

  function deletePixel(from, layer, x, y) {
    self[from] = self[from].filter(function(px) {
      return !(px.layer == layer && px.x == x && px.y == y);
    });
  };

  function flipHorizontal(pixel) {
    return pixel.flipHorizontal();
  }

  function flipVertical(pixel) {
    return pixel.flipVertical();
  }

  // message handlers
  // channel.file.subscribe('file.load', function() {
  //   self.file = file.pixels;
  //   self.frame = [];
  //   self.scope = [];
  // });

  // channel.gui.subscribe('frame.select', function(data, envelope) {
  //   self.frame = _.where(self.file, {frame: data.frame});
  // });

  // channel.gui.subscribe('layer.delete', function(data, envelope) {
  //   self.scope = [];
  //   self.file = file.pixels;
  //   self.frame = _.where(self.file, {frame: data.frame});
  // });

  channel.gui.subscribe('layer.drop', function(data, envelope) {
    self.file = file.pixels;
    self.frame = _.where(self.file, {frame: data.frame});
  });

  // channel.gui.subscribe('scope.set', function(data, envelope) {

    // update pixels in scope

    // if(data.old !== null && self.scope.length > 0) {
    //   // merge scope pixels back to frame
    //   self.scope.forEach(function(px) {
    //     var oldPixel = _.findWhere(self.frame, {x: px.x, y: px.y});
    //     if(!_.isUndefined(oldPixel)) {
    //       deletePixel('frame', px.layer, px.x, px.y);
    //     }
    //     self.frame.push(px);
    //   });

    //   self.scope = [];
    // }

    // var layer = data.scope === 'layer' ? data.data : data.old;

    // switch(data.scope) {
    //   case 'selection':
    //     // move pixels in selection to scope
    //     self.scope = _.remove(self.frame, function(px) {
    //       return px.layer === layer && editor.selection.contains(px);
    //     });
    //     break;

    //   case 'layer':
    //     // move pixels of layer to scope
    //     self.scope = _.remove(self.frame, {layer: layer});
    //     break;
    // }

    // self.log();
  // });

  channel.gui.subscribe('pixels.move', function(data, envelope) {
    var wrapPixel = function(px) { px.wrap(data.distance) };
    self.scope.forEach(wrapPixel);
    refreshPreviews();
  });

  // channel.gui.subscribe('pixel.add', function(data, envelope) {
  //   // add/replace pixel
  //   var c = new Color(data.color),
  //       a = 1;

  //   var newPixel = new Pixel(data.frame, data.layer, data.x, data.y, c.red(), c.green(), c.blue(), a, data.z);
  //   var oldPixel = _.findWhere(self.scope, {x: data.x, y: data.y});
  //   if(_.isUndefined(oldPixel)) {
  //     // console.log('filling pixel', data.layer, data.x, data.y, c.rgbString());
  //     self.scope.push(newPixel);
  //   }
  //   else {
  //     // console.log('replacing pixel', data.layer, data.x, data.y, c.rgbString());

  //     // replace old pixel
  //     for(var i = 0; i < self.scope.length; i++) {
  //       var p = self.scope[i];
  //       if(p.x == data.x && p.y == data.y) {
  //         p.r = c.red();
  //         p.g = c.green();
  //         p.b = c.blue();
  //         p.a = a;
  //         break;
  //       }
  //     }
  //   }
  // });

  channel.gui.subscribe('pixel.delete', function(data, envelope) {
    deletePixel('scope', data.layer, data.x, data.y);
    deletePixel('frame', data.layer, data.x, data.y);
    deletePixel('file', data.layer, data.x, data.y);
  });

  channel.gui.subscribe('scope.copy', function(data, envelope) {
    self.clipboard = self.scope;
  });

  channel.gui.subscribe('scope.cut', function(data, envelope) {
    self.clipboard = self.scope;
    self.scope.forEach(function(px) {
      channel.gui.publish('pixel.delete', px);
    });

    self.save();
  });

  channel.gui.subscribe('scope.paste', function(data, envelope) {
    // get current frame & layer
    var target = {
      frame: editor.frames.selected,
      layer: editor.layers.selected,
      z: file.getLayerById(editor.layers.selected).z,
    };

    // transform pixels from clipboard to new layer and add them
    self.clipboard.forEach(function(px) {
      var data = target;
      data.x = px.x;
      data.y = px.y;
      data.color = px.toHex();
      channel.gui.publish('pixel.add', data);
    });

    self.save();
  });

  channel.gui.subscribe('scope.delete', function(data, envelope) {
    self.scope.forEach(function(px) {
      channel.gui.publish('pixel.delete', px);
    });

    self.save();
  });

  channel.gui.subscribe('scope.flip.horizontal', function(data, envelope) {
    self.scope.forEach(flipHorizontal);
    self.save();
    refreshPreviews();
  });

  channel.gui.subscribe('scope.flip.vertical', function(data, envelope) {
    self.scope.forEach(flipVertical);
    self.save();
    refreshPreviews();
  });

  channel.gui.subscribe('frame.flip.horizontal', function(data, envelope) {
    self.scope.forEach(flipHorizontal);
    self.frame.forEach(flipHorizontal);
    self.save();
    refreshPreviews();
  });

  channel.gui.subscribe('frame.flip.vertical', function(data, envelope) {
    self.scope.forEach(flipVertical);
    self.frame.forEach(flipVertical);
    self.save();
    refreshPreviews();
  });


  channel.gui.subscribe('layer.merge', function(data, envelope) {

    // define where to look for top layer pixels
    var search = self.frame;
    if(data.top.id === editor.layers.selected) {
      search = self.scope;
    }

    // get pixels of top layer
    var topLayerPixels = _.filter(search, {layer: data.top.id});

    // prepare target pixels
    var target = {
      frame: data.bottom.frame,
      layer: data.bottom.id,
      z: data.bottom.z,
    };

    // select bottom layer
    channel.gui.publish('layer.select', {layer: data.bottom.id});

    // add pixels to bottom layer
    topLayerPixels.forEach(function(px) {
      var data = target;
      data.x = px.x;
      data.y = px.y;
      data.color = px.toHex();
      channel.gui.publish('pixel.add', data);
    });

    self.save();

    // delete top layer
    channel.file.publish('layer.delete', {layer: data.top.id});
  });


  channel.gui.subscribe('size.set', function(data, envelope) {
    self.file = file.pixels;
    self.frame = [];
    self.scope = [];

    channel.gui.publish('frame.select', {frame: editor.frames.selected});
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
  console.log('merging pixels back to file');
  this.merge('scope', 'file');
  this.merge('frame', 'file');
  file.pixels = this.file;
  this.log();
};

Editor.prototype.pixels.log = function() {
  console.log('clipboard: '+this.clipboard.length+' '+
              'scope: '+this.scope.length+' '+
              'frame: '+this.frame.length+' '+
              'file: '+this.file.length);
};