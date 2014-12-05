var File = function() {

  this.size = null;
  this.frames = null;
  this.layers = null;
  this.animations = null;
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

  function animationFromFile(animation) {
    return {
      name: animation[0],
      fps: animation[1],
      frames: animation[2],
    }
  };

  function animationToFile(animation) {
    return [
      animation.name,
      animation.fps,
      animation.frames,
    ];
  };

  this.getLayerById = function(id) {
    return _.findWhere(this.layers, {id: id}) || false;
  };

  this.getAnimationByName = function(name) {
    return _.findWhere(this.animations, {name: name}) || false;
  }

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
      animations: this.animations.map(animationToFile),
      pixels: this.pixels.map(Pixel.toArray),

    };
    return JSON.stringify(strObj);
  };

  this.fromJSON = function(json) {
    this.size = sizeFromFile(json.size);
    this.frames = framesFromFile(json.frames);
    this.layers = json.layers.map(layerFromFile);
    this.animations = json.animations.map(animationFromFile);

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

  // handle file saving
  channel.subscribe('file.save', function(data, envelope) {
    self.save();
  });

  // handle layer opacity change
  channel.subscribe('file.layer.opacity.select', function(data, envelope) {
    var layer = self.getLayerById(data.layer);
    layer.opacity = data.opacity;
  });

  // handle layer visibility toggle
  channel.subscribe('file.layer.visibility.toggle', function(data, envelope) {
    var layer = self.getLayerById(data.layer);
    layer.visible = data.visible;
  });

  // handle layer name change
  channel.subscribe('file.layer.name.select', function(data, envelope) {
    var layer = self.getLayerById(data.layer);
    layer.name = data.name;
  });

  // handle addition of new layer
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
    var newLayer = layerFromFile([newId, editor.frame.selected, 'Layer ' + newId, newZIndex, 100, true]);

    self.layers.splice(index, 0, newLayer);
    fixLayerZ(editor.frame.selected);

    channel.publish('app.layer.add', {frame: editor.frame.selected, layer: newId});
  });

  // handle layer removal
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

    channel.publish('app.layer.delete', {frame: editor.frame.selected, layer: shouldSelectLayer});
  });

  // handle addition of new animation
  channel.subscribe('file.animation.add', function(data, envelope) {
    var animation = {
      name: 'Animation '+ (self.animations.length+1),
      fps: 10,
      frames: [],
    };

    self.animations.push(animation);
    channel.publish('animation.add');
  });

  // handle deletion of an animation
  channel.subscribe('file.animation.delete', function(data, envelope) {
    self.animations = _.filter(self.animations, function(animation) {
      return animation.name !== data.name;
    });
    channel.publish('animation.delete');
  });

  // handle setting of animation FPS
  channel.subscribe('file.animation.fps', function(data, envelope) {
    var animation = self.getAnimationByName(data.name);
    animation.fps = +data.fps;
    channel.publish('animation.fps');
  });

  // handle animation renaming
  channel.subscribe('file.animation.rename', function(data, envelope) {
    var animation = self.getAnimationByName(data.oldName);
    animation.name = data.newName;
    channel.publish('animation.rename', data);
  });

  // handle animation frame adding
  channel.subscribe('file.animation.frame.add', function(data, envelope){
    var animation = self.getAnimationByName(data.animation);
    animation.frames.splice(data.position, 0, data.frame);
    channel.publish('animation.frame.add');
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