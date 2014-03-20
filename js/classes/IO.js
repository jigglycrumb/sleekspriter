var IO = function() {

  this.size = null;
  this.frames = null;
  this.layers = null;
  this.pixels = null;

  var self = this;

  function sizeFromFile(size) {
    return {
      width: size[0],
      height: size[1]
    };
  };

  function sizeToFile(size) {
    return [size.width, size.height];
  };

  function framesFromFile(frames) {
    return {
      x: frames[0],
      y: frames[1]
    };
  };

  function framesToFile(frames) {
    return [frames.x, frames.y];
  };

  function layerFromFile(layer) {
    return {
      id: layer[0],
      name: layer[1],
      z: layer[2],
      opacity: layer[3],
      visible: !!layer[4]
    };
  };

  function layerToFile(layer) {
    return [
      layer.id,
      layer.name,
      layer.z,
      layer.opacity,
      +layer.visible
    ];
  };

  function pixelFromFile(pixel) {
    return {
      frame: pixel[0],
      layer: pixel[1],
      x: pixel[2],
      y: pixel[3],
      r: pixel[4],
      g: pixel[5],
      b: pixel[6],
      a: pixel[7]
    };
  };

  function pixelToFile(pixel) {
    return [
      pixel.frame,
      pixel.layer,
      pixel.x,
      pixel.y,
      pixel.r,
      pixel.g,
      pixel.b,
      pixel.a
    ];
  };

  this.getLayerById = function(id) {
    return _.findWhere(this.layers, {id: id}) || false;
  };

  this.toJSONString = function() {
    var strObj = {
      size: sizeToFile(this.size),
      frames: framesToFile(this.frames),
      layers: this.layers.map(layerToFile),
      pixels: this.pixels.map(pixelToFile)
    };
    return JSON.stringify(strObj);
  };

  this.fromJSONString = function(json) {
    json = JSON.parse(json);
    this.size = sizeFromFile(json.size);
    this.frames = framesFromFile(json.frames);
    this.layers = json.layers.map(layerFromFile);
    this.pixels = json.pixels.map(pixelFromFile);

    // sort layers by z (top to bottom)
    this.layers = _.sortBy(this.layers, 'z').reverse();
  };

  function fixLayerZ() {
    self.layers.reverse();
    for(var i = 0; i < self.layers.length; i++) {
      self.layers[i].z = i;
    }
    self.layers.reverse();
  }


  // signal handlers
  signal.layerOpacityChanged.add(function(id, opacity) {
    var layer = self.getLayerById(id);
    layer.opacity = opacity;
  });

  signal.layerVisibilityChanged.add(function(id, visible) {
    var layer = self.getLayerById(id);
    layer.visible = visible;
  });

  signal.layerNameChanged.add(function(id, name) {
    var layer = self.getLayerById(id);
    layer.name = name;
  });

  signal.layerAddedToIO.add(function(layer) {

    var index = 0;
    for(var i=0; i < self.layers.length; i++) {
      if(self.layers[i].id === layer) {
        index = i;
        break;
      }
    }

    var newId = (_.max(self.layers, function(layer) { return layer.id; })).id + 1;
    var newLayer = layerFromFile([newId, 'new layer', index+1, 100, true]);

    self.layers.splice(index, 0, newLayer);
    fixLayerZ();
    signal.layerAdded.dispatch(newId);
  });

  signal.layerRemovedFromIO.add(function(layer) {

    var index = 0;
    for(var i=0; i < self.layers.length; i++) {
      if(self.layers[i].id === layer) {
        index = i;
        break;
      }
    }

    var shouldSelectLayer;

    if(_.isUndefined(self.layers[index+1]))
      shouldSelectLayer = self.layers[index-1].id;
    else
      shouldSelectLayer = self.layers[index+1].id;

    self.layers.splice(index, 1);
    fixLayerZ();
    signal.layerRemoved.dispatch(shouldSelectLayer);
  });

  signal.pixelFilled.add(function(frame, layer, x, y, color) {
    var c = color.rgb(),
        a = 1;

    var newPixel = pixelFromFile([frame, layer, x, y, c.r, c.g, c.b, a]);
    var oldPixel = _.findWhere(self.pixels, {frame: frame, layer: layer, x: x, y: y});
    if(_.isUndefined(oldPixel)) {
      console.log('filling pixel', layer, x, y, color.rgbString());
      self.pixels.push(newPixel);
    }
    else {
      console.log('replacing pixel', layer, x, y, color.rgbString());
      // replace old pixel
      for(var i = 0; i < self.pixels.length; i++) {
        var p = self.pixels[i];
        if(p.frame == frame && p.layer == layer && p.x == x && p.y == y) {
          p.r = c.r;
          p.g = c.g;
          p.b = c.b;
          p.a = a;
          break;
        }
      }
    }

    signal.layerContentChanged.dispatch(layer);
    //signal.frameContentChanged.dispatch();
  });

  signal.pixelCleared.add(function(frame, layer, x, y) {

    var index = 0;

    for(var i = 0; i < self.pixels.length; i++) {
      var p = self.pixels[i];
      if(p.frame == frame && p.layer == layer && p.x == x && p.y == y) {
        index = i;
        break;
      }
    }

    self.pixels.splice(index, 1);
    signal.layerContentChanged.dispatch(layer);
    //signal.frameContentChanged.dispatch();
  });
};

var io = new IO();