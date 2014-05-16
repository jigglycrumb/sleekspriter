var File = function() {

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

  this.getLayerById = function(id) {
    return _.findWhere(this.layers, {id: id}) || false;
  };

  this.deletePixelsOfLayer = function(layer) {
    this.pixels = this.pixels.filter(function(pixel) {
      return pixel.layer !== layer;
    });
  };

  this.toJSONString = function() {
    var strObj = {
      size: sizeToFile(this.size),
      frames: framesToFile(this.frames),
      layers: this.layers.map(layerToFile),
      pixels: this.pixels.map(Pixel.toArray)
    };
    return JSON.stringify(strObj);
  };

  this.fromJSONString = function(json) {
    json = JSON.parse(json);
    this.size = sizeFromFile(json.size);
    this.frames = framesFromFile(json.frames);
    this.layers = json.layers.map(layerFromFile);
    this.pixels = json.pixels.map(Pixel.fromArray);

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

  channel.subscribe('file.layer.opacity.select', function(data, envelope) {
    var layer = self.getLayerById(data.layer);
    layer.opacity = data.opacity;
  });

  channel.subscribe('file.layer.visibility.toggle', function(data, envelope) {
    var layer = self.getLayerById(data.layer);
    layer.visible = data.visible;
  });

  channel.subscribe('file.layer.name.select', function(data, envelope) {
    var layer = self.getLayerById(data.layer);
    layer.name = data.name;
  });

  // signal handlers

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
};