var File = function() {

  this.size = null;
  this.frames = null;
  this.layers = null;
  this.pixels = null;

  var self = this;

  this.deletePixelsOfLayer = function(layer) {
    this.pixels = this.pixels.filter(function(pixel) {
      return pixel.layer !== layer;
    });
  };

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
      frame: layer[1],
      name: layer[2],
      z: layer[3],
      opacity: layer[4],
      visible: !!layer[5]
    };
  };

  function layerToFile(layer) {
    return [
      layer.id,
      layer.frame,
      layer.name,
      layer.z,
      layer.opacity,
      +layer.visible
    ];
  };

  function pixelFromFile(pixel) {
    return {
      layer: pixel[0],
      x: pixel[1],
      y: pixel[2],
      r: pixel[3],
      g: pixel[4],
      b: pixel[5],
      a: pixel[6]
    };
  };

  function pixelToFile(pixel) {
    return [
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

  function fixLayerZ(frame) {
    self.layers.reverse();
    var z = 0;
    for(var i = 0; i < self.layers.length; i++) {
      if( self.layers[i].frame == frame) {
        self.layers[i].z = z;
        z++;
      }
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

  signal.file.layerAdded.add(function(layer) {

    var index = 0;
    for(var i=0; i < self.layers.length; i++) {
      if(self.layers[i].id === layer) {
        index = i;
        break;
      }
    }

    var frameLayers = _.where(self.layers, {frame: editor.frame});
    var newZIndex = (_.max(frameLayers, function(layer) { return layer.z; })).z + 1;

    var newId = (_.max(self.layers, function(layer) { return layer.id; })).id + 1;
    var newLayer = layerFromFile([newId, editor.frame, 'layer '+newId, newZIndex, 100, true]);

    self.layers.splice(index, 0, newLayer);
    fixLayerZ(editor.frame);
    signal.layerAdded.dispatch(newId);
  });

  signal.file.layerRemoved.add(function(layer) {

    // delete layer pixels
    self.deletePixelsOfLayer(layer);

    // get layer array index of all layers
    var index = 0;
    for(var i=0; i < self.layers.length; i++) {
      if(self.layers[i].id === layer) {
        index = i;
        break;
      }
    }

    // get layer array index of frame layers
    var frameLayers = _.where(self.layers, {frame: editor.frame});
    var fIndex = 0;
    for(var i=0; i < frameLayers.length; i++) {
      if(frameLayers[i].id === layer) {
        fIndex = i;
        break;
      }
    }

    // determine next layer to be selected in the UI
    var shouldSelectLayer;
    if(_.isUndefined(frameLayers[fIndex+1]))
      shouldSelectLayer = frameLayers[fIndex-1].id;
    else
      shouldSelectLayer = frameLayers[fIndex+1].id;

    // delete layer, reorder z indices, inform App of update
    self.layers.splice(index, 1);
    fixLayerZ(editor.frame);
    signal.layerRemoved.dispatch(shouldSelectLayer);
  });

  signal.file.pixelFilled.add(function(layer, x, y, color) {
    var c = color.rgb(),
        a = 1;

    var newPixel = pixelFromFile([layer, x, y, c.r, c.g, c.b, a]);
    var oldPixel = _.findWhere(self.pixels, {layer: layer, x: x, y: y});
    if(_.isUndefined(oldPixel)) {
      console.log('filling pixel', layer, x, y, color.rgbString());
      self.pixels.push(newPixel);
    }
    else {
      console.log('replacing pixel', layer, x, y, color.rgbString());
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

    signal.layerContentChanged.dispatch(layer);
  });

  signal.file.pixelCleared.add(function(layer, x, y) {


    self.pixels = _.without(self.pixels, {layer: layer, x: x, y: y});

    console.log('cleared pixel', layer, x, y, self.pixels.length);

    /*
    var index = 0;

    for(var i = 0; i < self.pixels.length; i++) {
      var p = self.pixels[i];
      if(p.frame == frame && p.layer == layer && p.x == x && p.y == y) {
        index = i;
        break;
      }
    }



    self.pixels.splice(index, 1);
    */
    signal.layerContentChanged.dispatch(layer);
  });
};

var file = new File();