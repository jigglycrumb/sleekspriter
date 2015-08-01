var File = function() {

  this.initProps();

  var self = this;

  // function sizeFromFile(size) {
  //   return {
  //     width: size[0],
  //     height: size[1]
  //   };
  // };

  function sizeToFile(size) {
    return [size.width, size.height];
  };

  // function framesFromFile(frames) {
  //   return {
  //     x: frames[0],
  //     y: frames[1]
  //   };
  // };

  function framesToFile(frames) {
    return [frames.x, frames.y];
  };

  // function layerFromFile(layer) {
  //   return {
  //     id: layer[0],
  //     frame: layer[1],
  //     name: layer[2],
  //     z: layer[3],
  //     opacity: layer[4],
  //     visible: !!layer[5]
  //   };
  // };

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

  // function animationFromFile(animation) {
  //   return {
  //     name: animation[0],
  //     fps: animation[1],
  //     frames: animation[2],
  //   }
  // };

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

    channel.file.publish('file.load', {size: this.size, frames: this.frames});
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

  function fixPixelZ() {
    // refresh z values of all pixels
    var layerZ = {};
    self.layers.forEach(function(layer) {
      layerZ[layer.id] = layer.z;
    });

    self.pixels.forEach(function(pixel) {
      var layer = pixel[0],
          z = layerZ[layer];
      pixel.z = z;
    });
  }

  // handle file opening
  // channel.file.subscribe('open', function(data, envelope) {
  //   self.showOpenFileDialog();
  // });

  // handle file closing
  channel.file.subscribe('close', function(data, envelope) {
    // todo: ask for save/don't save/cancel, then properly close the file
    channel.file.publish('save');
    channel.gui.publish('screen.select', {target: 'start'});
  });

  channel.file.subscribe('path.set', function(data, envelope) {
    self.showSaveFileDialog();
  });

  // handle file loading
  // channel.file.subscribe('load', function(data, envelope) {
  //   self.load(data.path);
  // });

  // handle file save
  channel.file.subscribe('save', function(data, envelope) {
    self.save();
  });

  // handle file save
  channel.file.subscribe('save.as', function(data, envelope) {
    self.saveAs(data.path);
  });


  // handle layer opacity change
  // channel.file.subscribe('layer.opacity.select', function(data, envelope) {
  //   var layer = self.getLayerById(data.layer);
  //   layer.opacity = data.opacity;
  //   channel.gui.publish('layer.opacity.select', data);
  // });

  // handle layer visibility toggle
  // channel.file.subscribe('layer.visibility.toggle', function(data, envelope) {
  //   var layer = self.getLayerById(data.layer);
  //   layer.visible = data.visible;
  //   channel.gui.publish('layer.visibility.toggle', data);
  // });

  // handle layer name change
  // channel.file.subscribe('layer.name.select', function(data, envelope) {
  //   var layer = self.getLayerById(data.layer);
  //   layer.name = data.name;
  //   channel.gui.publish('layer.name.select', data);
  // });

  // handle layer drag & drop
  channel.file.subscribe('layer.drop', function(data, envelope) {
    var dropLayer = self.getLayerById(data.layer),
        dropFrame = dropLayer.frame;

    var tempLayers = _.partition(self.layers, function(layer) {
      return layer.frame == dropFrame;
    });

    var frameLayers = tempLayers[0],
        otherLayers = tempLayers[1];

    // remove dragged layer from frame layers
    frameLayers = frameLayers.filter(function(item) {
      return item.id !== data.layer;
    });

    // re-insert layer at new position
    frameLayers.splice(data.position, 0, dropLayer).join();

    // merge layers back together
    self.layers = frameLayers.concat(otherLayers);

    // fix layer z-indices
    fixLayerZ(dropFrame);

    // fix pixel z-indices
    fixPixelZ();

    data.frame = dropFrame;

    channel.gui.publish('layer.drop', data);
  });

  // handle addition of new layer
  channel.file.subscribe('layer.add', function(data, envelope) {
    var index = 0;
    for(var i=0; i < self.layers.length; i++) {
      if(self.layers[i].id === data.layer) {
        index = i;
        break;
      }
    }

    var frameLayers = _.where(self.layers, {frame: editor.frames.selected});
    var newZIndex = (_.max(frameLayers, function(layer) { return layer.z; })).z + 1;

    var newId = (_.max(self.layers, function(layer) { return layer.id; })).id + 1;
    var newLayer = layerFromFile([newId, editor.frames.selected, 'Layer ' + newId, newZIndex, 100, true]);

    self.layers.splice(index, 0, newLayer);
    fixLayerZ(editor.frames.selected);

    channel.gui.publish('layer.add', {frame: editor.frames.selected, layer: newId});
  });

  // handle layer removal
  channel.file.subscribe('layer.delete', function(data, envelope) {
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
    var frameLayers = _.where(self.layers, {frame: editor.frames.selected});
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
    fixLayerZ(editor.frames.selected);

    channel.gui.publish('layer.delete', {frame: editor.frames.selected, layer: shouldSelectLayer});
  });

  // handle addition of new animation
  // channel.file.subscribe('animation.add', function(data, envelope) {
  //   var animation = {
  //     name: 'Animation '+ (self.animations.length+1),
  //     fps: 10,
  //     frames: [],
  //   };

  //   self.animations.push(animation);
  //   channel.gui.publish('animation.add', {name: animation.name});
  // });

  // handle deletion of an animation
  // channel.file.subscribe('animation.delete', function(data, envelope) {

  //   var shouldSelectAnimation;

  //   for(var i = 0; i < self.animations.length; i++) {
  //     if(self.animations[i].name === data.name) {
  //       if(i > 0) shouldSelectAnimation = self.animations[i-1].name;
  //       else if(i < self.animations.length) {
  //         if(i === 0 && self.animations.length === 1) shouldSelectAnimation = null;
  //         else shouldSelectAnimation = self.animations[i+1].name;
  //       }
  //     }
  //   }

  //   self.animations = _.filter(self.animations, function(animation) {
  //     return animation.name !== data.name;
  //   });

  //   channel.gui.publish('animation.delete', {name: shouldSelectAnimation});
  // });

  // handle setting of animation FPS
  // channel.file.subscribe('animation.fps', function(data, envelope) {
  //   var animation = self.getAnimationByName(data.name);
  //   animation.fps = +data.fps;
  //   channel.gui.publish('animation.fps');
  // });

  // handle animation renaming
  // channel.file.subscribe('animation.rename', function(data, envelope) {
  //   var animation = self.getAnimationByName(data.oldName);
  //   animation.name = data.newName;
  //   channel.gui.publish('animation.rename', data);
  // });

  // handle animation frame adding
  // channel.file.subscribe('animation.frame.add', function(data, envelope) {
  //   var animation = self.getAnimationByName(data.animation);
  //   animation.frames.splice(data.position, 0, data.frame);
  //   channel.gui.publish('animation.frame.add');
  // });

  // handle animation frame removal
  // channel.file.subscribe('animation.frame.delete', function(data, envelope) {
  //   var animation = self.getAnimationByName(data.animation);
  //   if(animation.frames[data.position] === data.frame) {
  //     animation.frames.splice(data.position, 1);
  //   }
  //   channel.gui.publish('animation.frame.delete', data);
  // });

  // channel.file.subscribe('animation.frames.empty', function(data, envelope) {
  //   self.getAnimationByName(data.animation).frames = [];
  // });
};


File.prototype = {};

/**
 * Create a new file
 * @param  {Number} framesX Number of frames per row
 * @param  {Number} framesY Number of frames per column
 * @param  {Number} pixelsX Width of a single frame
 * @param  {Number} pixelsY Height of a single frame
 */
// File.prototype.create = function(framesX, framesY, pixelsX, pixelsY) {
//   var json = {},
//       totalFrames = framesX * framesY;

//   json.frames = [+framesX, +framesY];
//   json.size = [+pixelsX, +pixelsY];
//   json.layers = [];
//   json.animations = [];
//   json.pixels = [];

//   for(var i = 0; i < totalFrames; i++) {
//     json.layers.push([i+1, i+1, 'Layer '+(i+1), 0, 100, 1]);
//   }

//   this.path = null;
//   this.name = '';
//   this.folder = null;
//   this.fromJSON(json);

//   channel.gui.publish('frame.select', {frame: 1});
// };


/**
 * Update frame count and frame size
 * @param  {Number} framesX New number of frames per row
 * @param  {Number} framesY New number of frames per column
 * @param  {Number} pixelsX New width of a single frame
 * @param  {Number} pixelsY New height of a single frame
 */
File.prototype.updateDimensions = function(framesX, framesY, pixelsX, pixelsY) {

  // have frame columns been added?
  if(this.frames.x < framesX) {

    var newColumns = framesX - this.frames.x;

    function moveToNewFrame(obj) {
      var y = Math.ceil(obj.frame/this.frames.x),
          newFrame = obj.frame+((y-1)*newColumns);
      obj.frame = newFrame;
    }

    // move layers to new frame
    this.layers.forEach(moveToNewFrame, this);

    // move pixels to new frame
    this.pixels.forEach(moveToNewFrame, this);

    // add new layers
    for(var y = 1; y <= this.frames.y; y++) {
      for(var i = 1; i <= newColumns; i++) {
        var id = _.max(this.layers, 'id').id+1,
            layer = {
              frame: (this.frames.x*y)+((y-1)*newColumns)+i,
              id: id,
              name: 'Layer '+id,
              opacity: 100,
              visible: true,
              z: 0,
            };

        this.layers.push(layer);
      }
    }
    this.frames.x = framesX;
  }


  // have frame columns been removed?
  if(this.frames.x > framesX) {

    var columnsToRemove = this.frames.x - framesX,
        framesToDelete = [];

    // calc frames to be removed
    for(var row = 1; row <= this.frames.y; row++) {
      for(var col = 1; col <= this.frames.x; col++) {
        var frame = (this.frames.x*(row-1))+col;
        if(col > framesX) framesToDelete.push(frame);
      }
    }

    function deleteFrames(obj) {
      return !_.includes(framesToDelete, obj.frame);
    }

    // delete pixels & layers
    this.pixels = this.pixels.filter(deleteFrames);
    this.layers = this.layers.filter(deleteFrames);

    function fixFrame(obj) {
      var y = Math.ceil(obj.frame/this.frames.x),
          newFrame = obj.frame-((y-1)*columnsToRemove);
      obj.frame = newFrame;
    }

    // move remaining pixels & layers
    this.pixels.forEach(fixFrame, this);
    this.layers.forEach(fixFrame, this);
    this.frames.x = framesX;
  }

  // have frame rows been added?
  if(this.frames.y < framesY) {
    this.frames.y = framesY;
  }

  // have frame rows been removed?
  if(this.frames.y > framesY) {
    var lastFrame = this.frames.x * framesY;

    function deleteLastFrames(obj) {
      return obj.frame <= lastFrame;
    }

    // delete pixels & layers
    this.pixels = this.pixels.filter(deleteLastFrames);
    this.layers = this.layers.filter(deleteLastFrames);
    this.frames.y = framesY;
  }

  // new width > old width?
  if(this.size.width < pixelsX) {
    this.size.width = pixelsX;
  }

  // new width < old width?
  if(this.size.width > pixelsX) {
    // delete pixels
    this.pixels = this.pixels.filter(function(px) {
      return px.x <= pixelsX;
    });
    this.size.width = pixelsX;
  }

  // new height > old height?
  if(this.size.height < pixelsY) {
    this.size.height = pixelsY;
  }

  // new height < old height?
  if(this.size.height > pixelsY) {
    // delete pixels
    this.pixels = this.pixels.filter(function(px) {
      return px.y <= pixelsY;
    });
    this.size.height = pixelsY;
  }


  var data = {
    frames: this.frames,
    size: this.size,
  };

  channel.gui.publish('size.set', data);
};

File.prototype.initProps = function() {
  this.path = null;
  this.name = null;
  this.folder = null;

  this.size = null;
  this.frames = null;
  this.layers = null;
  this.animations = null;
  this.pixels = null;
};