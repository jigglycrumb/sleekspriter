var FileStore = Fluxxor.createStore({
  initialize: function() {
    this.resetData();
    this.bindActions(
      constants.FILE_CREATE,      this.onFileCreate,
      constants.FILE_LOAD,        this.onFileLoad,
      constants.FILE_SAVE,        this.onFileSave,


      constants.LAYER_VISIBILITY, this.onLayerVisibility,
      constants.LAYER_OPACITY,    this.onLayerOpacity,
      constants.LAYER_NAME,       this.onLayerName,

      constants.ANIMATION_NAME,   this.onAnimationName,
      constants.ANIMATION_FPS,    this.onAnimationFps
    );
  },

  getData: function(key) {
    if(key && this.data[key]) return this.data[key];
    else return this.data;
  },

  resetData: function(key) {
    var data = {
      path: '',
      name: '',
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

  onFileCreate: function(payload) {
    var json = {},
        totalFrames = payload.framesX * payload.framesY;

    json.frames = [+payload.framesX, +payload.framesY];
    json.size = [+payload.pixelsX, +payload.pixelsY];
    json.layers = [];
    json.animations = [];
    json.pixels = [];

    for(var i = 0; i < totalFrames; i++) {
      json.layers.push([i+1, i+1, 'Layer '+(i+1), 0, 100, 1]);
    }

    this.resetData();
    this._fromJSON(json);

    this.emit('change');
  },

  onFileLoad: function(payload) {
    this.resetData();
    this._fromJSON(payload.json);

    this.data.path    = payload.path;
    this.data.name    = payload.name;
    this.data.folder  = payload.folder;

    this.emit('change');
  },

  onFileSave: function(payload) {
    console.log('FileStore.onFileSave');
    this.emit('change');
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

  onAnimationName: function(payload) {
    var animation = storeUtils.animations.getByName(payload.animation);
    animation.name = payload.name;
    this.data.animations.forEach(function(a) {
      if(a.name === payload.animation) a = animation;
    });
    this.emit('change');
  },

  onAnimationFps: function(payload) {
    var animation = storeUtils.animations.getByName(payload.animation);
    animation.fps = parseInt(payload.fps);
    this.data.animations.forEach(function(a) {
      if(a.name === payload.animation) a = animation;
    });
    this.emit('change');
  },

  _fromJSON: function(json) {
    this.data.size = this._sizeFromFile(json.size);
    this.data.frames = this._framesFromFile(json.frames);
    this.data.layers = json.layers.map(this._layerFromFile);
    this.data.animations = json.animations.map(this._animationFromFile);

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

  _sizeFromFile: function(size) {
    return {
      width: size[0],
      height: size[1]
    };
  },

  _framesFromFile: function(frames) {
    return {
      x: frames[0],
      y: frames[1]
    };
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

  _animationFromFile: function(animation) {
    return {
      name: animation[0],
      fps: animation[1],
      frames: animation[2],
    }
  },

});