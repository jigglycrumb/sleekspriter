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

  this.fromJSON = function(json) {
    this.size = sizeFromFile(json.size);
    this.frames = framesFromFile(json.frames);
    this.layers = json.layers.map(layerFromFile);

    // add z and frame values to saved pixels
    var layerDict = {};
    this.layers.forEach(function(layer) {
      layerDict[layer.id] = {
        frame: layer.frame,
        z: layer.z
      };
    });

    json.pixels.forEach(function(pixel) {
      var layer = pixel[0],
          z = layerDict[layer].z,
          frame = layerDict[layer].frame;
      pixel.unshift(frame);
      pixel.push(z);
    });

    this.pixels = json.pixels.map(Pixel.fromArray);

    // sort layers by z (top to bottom)
    this.layers = _.sortBy(this.layers, 'z').reverse();

    channel.publish('file.load', {size: this.size, frames: this.frames});
  };

  this.fromJSONString = function(string) {
    json = JSON.parse(string);
    this.fromJSON(json);
  };

  this.getFrameIdForLayer = function(layer)  {
    return _.findWhere(this.layers, {id: layer}).frame;
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

  channel.subscribe('file.save', function(data, envelope) {
    self.save();
  });

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

  channel.subscribe('file.layer.add', function(data, envelope) {
    var index = 0;
    for(var i=0; i < self.layers.length; i++) {
      if(self.layers[i].id === data.layer) {
        index = i;
        break;
      }
    }

    var frameLayers = _.where(self.layers, {frame: editor.frame.selected});
    var newZIndex = (_.max(frameLayers, function(layer) { return layer.z; })).z + 1;

    var newId = (_.max(self.layers, function(layer) { return layer.id; })).id + 1;
    var newLayer = layerFromFile([newId, editor.frame.selected, 'layer '+newId, newZIndex, 100, true]);

    self.layers.splice(index, 0, newLayer);
    fixLayerZ(editor.frame.selected);

    channel.publish('app.layer.add', {layer: newId});
  });

  channel.subscribe('file.layer.delete', function(data, envelope) {
    // delete layer pixels
    self.deletePixelsOfLayer(data.layer);

    // get layer array index of all layers
    var index = 0;
    for(var i=0; i < self.layers.length; i++) {
      if(self.layers[i].id === data.layer) {
        index = i;
        break;
      }
    }

    // get layer array index of frame layers
    var frameLayers = _.where(self.layers, {frame: editor.frame.selected});
    var fIndex = 0;
    for(var i=0; i < frameLayers.length; i++) {
      if(frameLayers[i].id === data.layer) {
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
    fixLayerZ(editor.frame.selected);

    channel.publish('app.layer.delete', {layer: shouldSelectLayer});
  });
};


File.prototype = {};
File.prototype.save = function() {
  console.log('saving file to disk');
};


File.load = function(file, callback) {

  console.info('File: '+file);

  var url = 'mock/loadfile.php?file=' + file;
  $.getJSON(url, callback);
};