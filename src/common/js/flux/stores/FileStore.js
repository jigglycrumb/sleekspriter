var FileStore = Fluxxor.createStore({
  initialize: function() {
    this.resetData();
    this.bindActions(
      constants.FILE_CREATE,              this.onFileCreate,
      constants.FILE_LOAD,                this.onFileLoad,
      constants.FILE_SAVE,                this.onFileSave,
      constants.FILE_SAVE_AS,             this.onFileSaveAs,
      constants.FILE_SIZE,                this.onFileSize,

      constants.LAYER_VISIBILITY,         this.onLayerVisibility,
      constants.LAYER_OPACITY,            this.onLayerOpacity,
      constants.LAYER_NAME,               this.onLayerName,
      constants.LAYER_ADD,                this.onLayerAdd,
      constants.LAYER_DELETE,             this.onLayerDelete,
      constants.LAYER_DROP,               this.onLayerDrop,

      constants.ANIMATION_NAME,           this.onAnimationName,
      constants.ANIMATION_FPS,            this.onAnimationFps,
      constants.ANIMATION_ADD,            this.onAnimationAdd,
      constants.ANIMATION_DELETE,         this.onAnimationDelete,
      constants.ANIMATION_FRAME_ADD,      this.onAnimationFrameAdd,
      constants.ANIMATION_FRAME_EMPTY,    this.onAnimationFrameEmpty,
      constants.ANIMATION_FRAME_DELETE,   this.onAnimationFrameDelete,

      constants.FRAME_DUPLICATE,          this.onFrameDuplicate
    );
  },

  getData: function(key) {
    if(key && this.data[key]) return this.data[key];
    else return this.data;
  },

  resetData: function(key) {
    var data = {
      path: '',
      name: 'Unnamed',
      folder: '',

      size: {width: 0, height: 0},
      frames: {x: 0, y: 0},
      layers: [],
      animations: [],
      pixels: [],
    };

    if(key && data[key]) this.data[key] = data[key];
    else this.data = data;
  },

  //----------------------------------------------------------------------------
  // Action handlers
  //----------------------------------------------------------------------------

  onFileCreate: function(payload) {
    var json = {},
        totalFrames = payload.frames.x * payload.frames.y;

    json.frames = [+payload.frames.x, +payload.frames.y];
    json.size = [+payload.pixels.x, +payload.pixels.y];
    json.layers = [];
    json.animations = [];
    json.pixels = [];

    for(var i = 0; i < totalFrames; i++) {
      json.layers.push([i+1, i+1, 'Layer '+(i+1), 0, 100, 1]);
    }

    this.resetData();
    this._fromJSON(json);

    platformUtils.setWindowTitle('@@name - '+this.data.name+'.pixels');

    this.emit('change');
  },

  onFileLoad: function(payload) {
    this.resetData();
    this._fromJSON(payload.json);

    this.data.path    = payload.path;
    this.data.name    = payload.name;
    this.data.folder  = payload.folder;

    platformUtils.setWindowTitle('@@name - '+this.data.name+'.pixels');

    this.emit('change');
  },

  onFileSave: function() {
    this.waitFor(['PixelStore'], function(PixelStore) {
      this.data.pixels = PixelStore.getData().file;
      var json = this._toJSON();
      platformUtils.saveFile(json);
      platformUtils.setWindowTitle('@@name - '+this.data.name+'.pixels');
      this.emit('change');
    });
  },

  onFileSaveAs: function(path) {
    this.waitFor(['PixelStore'], function(PixelStore) {
      this.data.pixels = PixelStore.getData().file;

      var p = platformUtils.getPathData(path);

      console.log('saving AS', path);
      this.data.path = p.path;
      this.data.name = p.name;
      this.data.folder = p.folder;

      var json = this._toJSON();
      platformUtils.saveFile(json);
      platformUtils.setWindowTitle('@@name - '+this.data.name+'.pixels');
      this.emit('change');
    });
  },

  onFileSize: function(payload) {
    this.waitFor(['PixelStore'], function(PixelStore) {
      this.data.pixels = PixelStore.getData().file;

      // have frame columns been added?
      if(this.data.frames.x < payload.frames.x) {

        var newColumns = payload.frames.x - this.data.frames.x;

        function moveToNewFrame(obj) {
          var y = Math.ceil(obj.frame/this.data.frames.x),
              newFrame = obj.frame+((y-1)*newColumns);
          obj.frame = newFrame;
        }

        // move layers to new frame
        this.data.layers.forEach(moveToNewFrame, this);

        // move pixels to new frame
        this.data.pixels.forEach(moveToNewFrame, this);

        // add new layers
        for(var y = 1; y <= this.data.frames.y; y++) {
          for(var i = 1; i <= newColumns; i++) {
            var id = _.max(this.data.layers, 'id').id+1,
                layer = {
                  frame: (this.data.frames.x*y)+((y-1)*newColumns)+i,
                  id: id,
                  name: 'Layer '+id,
                  opacity: 100,
                  visible: true,
                  z: 0,
                };

            this.data.layers.push(layer);
          }
        }
        this.data.frames.x = payload.frames.x;
      }


      // have frame columns been removed?
      if(this.data.frames.x > payload.frames.x) {

        var columnsToRemove = this.data.frames.x - payload.frames.x,
            framesToDelete = [];

        // calc frames to be removed
        for(var row = 1; row <= this.data.frames.y; row++) {
          for(var col = 1; col <= this.data.frames.x; col++) {
            var frame = (this.data.frames.x*(row-1))+col;
            if(col > payload.frames.x) framesToDelete.push(frame);
          }
        }

        function deleteFrames(obj) {
          return !_.includes(framesToDelete, obj.frame);
        }

        // delete pixels & layers
        this.data.pixels = this.data.pixels.filter(deleteFrames);
        this.data.layers = this.data.layers.filter(deleteFrames);

        function fixFrame(obj) {
          var y = Math.ceil(obj.frame/this.data.frames.x),
              newFrame = obj.frame-((y-1)*columnsToRemove);
          obj.frame = newFrame;
        }

        // move remaining pixels & layers
        this.data.pixels.forEach(fixFrame, this);
        this.data.layers.forEach(fixFrame, this);
        this.data.frames.x = payload.frames.x;
      }

      // have frame rows been added?
      if(this.data.frames.y < payload.frames.y) {

        var newRows = payload.frames.y - this.data.frames.y;

        // add new layers
        for(var y = this.data.frames.y; y <= payload.frames.y; y++) {
          for(var i = 1; i <= this.data.frames.x; i++) {
            var id = _.max(this.data.layers, 'id').id+1,
                layer = {
                  frame: (this.data.frames.x*y)+i,
                  id: id,
                  name: 'Layer '+id,
                  opacity: 100,
                  visible: true,
                  z: 0,
                };

            this.data.layers.push(layer);
          }
        }

        this.data.frames.y = payload.frames.y;
      }

      // have frame rows been removed?
      if(this.data.frames.y > payload.frames.y) {
        var lastFrame = this.data.frames.x * payload.frames.y;

        function deleteLastFrames(obj) {
          return obj.frame <= lastFrame;
        }

        // delete pixels & layers
        this.data.pixels = this.data.pixels.filter(deleteLastFrames);
        this.data.layers = this.data.layers.filter(deleteLastFrames);
        this.data.frames.y = payload.frames.y;
      }

      // new width > old width?
      if(this.data.size.width < payload.pixels.x) {
        this.data.size.width = payload.pixels.x;
      }

      // new width < old width?
      if(this.data.size.width > payload.pixels.x) {
        // delete pixels
        this.data.pixels = this.data.pixels.filter(function(px) {
          return px.x <= payload.pixels.x;
        });
        this.data.size.width = payload.pixels.x;
      }

      // new height > old height?
      if(this.data.size.height < payload.pixels.y) {
        this.data.size.height = payload.pixels.y;
      }

      // new height < old height?
      if(this.data.size.height > payload.pixels.y) {
        // delete pixels
        this.data.pixels = this.data.pixels.filter(function(px) {
          return px.y <= payload.pixels.y;
        });
        this.data.size.height = payload.pixels.y;
      }

      this.emit('change');
    });
  },

  onLayerVisibility: function(payload) {
    var layer = storeUtils.layers.getById(parseInt(payload.layer));
    layer.visible = !!payload.visible;
    this.data.layers.forEach(function(l) {
      if(l.id === layer.id) l = layer;
    });
    this.emit('change');
  },

  onLayerOpacity: function(payload) {
    var layer = storeUtils.layers.getById(parseInt(payload.layer));
    layer.opacity = parseInt(payload.opacity);
    this.data.layers.forEach(function(l) {
      if(l.id === layer.id) l = layer;
    });
    this.emit('change');
  },

  onLayerName: function(payload) {
    var layer = storeUtils.layers.getById(parseInt(payload.layer));
    layer.name = payload.name;
    this.data.layers.forEach(function(l) {
      if(l.id === layer.id) l = layer;
    });
    this.emit('change');
  },

  onLayerAdd: function(selectedLayer) {

    var selectedFrame = flux.stores.UiStore.getData().frames.selected,
        index = 0;

    for(var i=0; i < this.data.layers.length; i++) {
      if(this.data.layers[i].id === selectedLayer) {
        index = i;
        break;
      }
    }

    var frameLayers = _.where(this.data.layers, {frame: selectedFrame});
    var newZIndex = (_.max(frameLayers, function(layer) { return layer.z; })).z + 1;

    var newId = (_.max(this.data.layers, function(layer) { return layer.id; })).id + 1;
    var newLayer = this._layerFromFile([newId, selectedFrame, 'Layer ' + newId, newZIndex, 100, true]);

    this.data.layers.splice(index, 0, newLayer);
    this._fixLayerZ(selectedFrame);

    this.emit('change');
  },

  onLayerDelete: function(id) {
    this.waitFor(['PixelStore'], function() {
      var selectedFrame = flux.stores.UiStore.getData().frames.selected,
          index = 0;

      for(var i=0; i < this.data.layers.length; i++) {
        if(this.data.layers[i].id === id) {
          index = i;
          break;
        }
      }

      this.data.layers.splice(index, 1);
      this._fixLayerZ(selectedFrame);

      this.emit('change');
    });
  },

  onLayerDrop: function(payload) {

    var dropLayer = storeUtils.layers.getById(payload.layer),
        dropFrame = dropLayer.frame;

    var tempLayers = _.partition(this.data.layers, function(layer) {
      return layer.frame == dropFrame;
    });

    var frameLayers = tempLayers[0],
        otherLayers = tempLayers[1];

    // remove dragged layer from frame layers
    frameLayers = frameLayers.filter(function(item) {
      return item.id !== payload.layer;
    });

    // re-insert layer at new position
    frameLayers.splice(payload.position, 0, dropLayer).join();

    // merge layers back together
    this.data.layers = frameLayers.concat(otherLayers);

    // fix layer z-indices
    this._fixLayerZ(dropFrame);

    this.emit('change');
  },

  onAnimationName: function(payload) {
    var animation = storeUtils.animations.getById(payload.animation);
    animation.name = payload.name;
    this.data.animations.forEach(function(a) {
      if(a.id === payload.animation) a = animation;
    });
    this.emit('change');
  },

  onAnimationFps: function(payload) {
    var animation = storeUtils.animations.getById(payload.animation);
    animation.fps = parseInt(payload.fps);
    if(animation.fps < 1) animation.fps = 1;
    this.data.animations.forEach(function(a) {
      if(a.id === payload.animation) a = animation;
    });
    this.emit('change');
  },

  onAnimationAdd: function() {
    var newId = (_.max(this.data.animations, function(animation) { return animation.id; })).id + 1 || 1,
        animation = {
          id: newId,
          name: 'Animation '+ newId,
          fps: 10,
          frames: [],
        };

    this.data.animations.push(animation);
    this.emit('change');
  },

  onAnimationDelete: function(id) {
    this.data.animations = _.filter(this.data.animations, function(a) {
      return a.id !== id;
    });
    this.emit('change');
  },

  onAnimationFrameAdd: function(payload) {
    var animation = storeUtils.animations.getById(payload.animation);
    animation.frames.splice(payload.position, 0, payload.frame);
    this.data.animations.forEach(function(a) {
      if(a.id === payload.animation) a = animation;
    });
    this.emit('change');
  },

  onAnimationFrameEmpty: function(id) {
    var animation = storeUtils.animations.getById(id);
    animation.frames = [];
    this.data.animations.forEach(function(a) {
      if(a.id === id) a = animation;
    });
    this.emit('change');
  },

  onAnimationFrameDelete: function(payload) {
    var animation = storeUtils.animations.getById(payload.animation);
    if(animation.frames[payload.position] === payload.frame) {
      animation.frames.splice(payload.position, 1);
    }
    this.data.animations.forEach(function(a) {
      if(a.id === payload.animation) a = animation;
    });
    this.emit('change');
  },

  onFrameDuplicate: function(payload) {
    this.data.pixels = flux.stores.PixelStore.getData().file;

    // collect layers & pixels of source frame
    var layers = [],
        pixels = [];

    this.data.layers.forEach(function(layer) {
      if(layer.frame === payload.source) layers.push(_.clone(layer, true));
    });

    this.data.pixels.forEach(function(pixel) {
      if(pixel.frame === payload.source) pixels.push(pixel.clone());
    });

    // delete pixels of target frame
    this.data.pixels = _.filter(this.data.pixels, function(n) { return n.frame !== payload.target; }, this);

    // delete layers of target frame
    this.data.layers = _.filter(this.data.layers, function(n) { return n.frame !== payload.target; }, this);

    var layerdict = {},
        maxId = (_.max(this.data.layers, 'id')).id;

    // add layers
    layers.forEach(function(layer, i) {
      var oldId = layer.id;
      layer.id = maxId + i + 1;
      layer.frame = payload.target;
      layerdict[oldId] = maxId + i + 1;
      this.data.layers.push(layer);
    }, this);

    // add pixels
    pixels.forEach(function(px) {
      px.frame = payload.target;
      px.layer = layerdict[px.layer];
      this.data.pixels.push(px);
    }, this);

    this.emit('change');
  },

  //----------------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------------

  _fromJSON: function(json) {
    this.data.size = this._sizeFromFile(json.size);
    this.data.frames = this._framesFromFile(json.frames);
    this.data.layers = json.layers.map(this._layerFromFile);
    this.data.animations = _.sortBy(json.animations.map(this._animationFromFile), 'name');

    // add z and frame values to saved pixels
    var layerDict = {};
    this.data.layers.forEach(function(layer) {
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

    this.data.pixels = json.pixels.map(Pixel.fromArray);

    // sort layers by z (top to bottom)
    this.data.layers = _.sortBy(this.data.layers, 'z').reverse();
  },

  _toJSON: function() {
    var strObj = {
      size: this._sizeToFile(this.data.size),
      frames: this._framesToFile(this.data.frames),
      layers: this.data.layers.map(this._layerToFile),
      animations: this.data.animations.map(this._animationToFile),
      pixels: this.data.pixels.map(Pixel.toArray),

    };
    return JSON.stringify(strObj);
  },

  _sizeFromFile: function(size) {
    return {
      width: size[0],
      height: size[1]
    };
  },

  _sizeToFile: function(size) {
    return [size.width, size.height];
  },

  _framesFromFile: function(frames) {
    return {
      x: frames[0],
      y: frames[1]
    };
  },

  _framesToFile: function(frames) {
    return [frames.x, frames.y];
  },

  _layerFromFile: function(layer) {
    return {
      id: layer[0],
      frame: layer[1],
      name: layer[2],
      z: layer[3],
      opacity: layer[4],
      visible: !!layer[5]
    };
  },

  _layerToFile: function(layer) {
    return [
      layer.id,
      layer.frame,
      layer.name,
      layer.z,
      layer.opacity,
      +layer.visible
    ];
  },

  _animationFromFile: function(animation) {
    return {
      id: animation[0],
      name: animation[1],
      fps: animation[2],
      frames: animation[3],
    };
  },

  _animationToFile: function(animation) {
    return [
      animation.id,
      animation.name,
      animation.fps,
      animation.frames,
    ];
  },

  _fixLayerZ: function(frame) {
    this.data.layers.reverse();
    var z = 0;
    for(var i = 0; i < this.data.layers.length; i++) {
      if( this.data.layers[i].frame == frame) {
        this.data.layers[i].z = z;
        z++;
      }
    }
    this.data.layers.reverse();
  },

});

// module.exports = new FileStore();
