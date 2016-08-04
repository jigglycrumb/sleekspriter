var PixelStore = Fluxxor.createStore({
  initialize: function() {
    this.resetData();
    this.bindActions(
      constants.FILE_LOAD,                    this.onFileCreateAndLoad,
      constants.FILE_CREATE,                  this.onFileCreateAndLoad,
      constants.FILE_SAVE,                    this.onFileSave,
      constants.FILE_SAVE_AS,                 this.onFileSave,
      constants.FILE_SIZE,                    this.onFileSave,

      constants.FRAME_SELECT,                 this.onFrameSelect,
      constants.FRAME_FLIP_HORIZONTAL,        this.onFrameFlipHorizontal,
      constants.FRAME_FLIP_VERTICAL,          this.onFrameFlipVertical,
      constants.FRAME_DUPLICATE,              this.onFrameDuplicate,
      constants.FRAME_ROTATE,                 this.onFrameRotate,

      constants.LAYER_DELETE,                 this.onLayerDelete,
      constants.LAYER_DROP,                   this.onLayerDrop,
      constants.LAYER_MERGE,                  this.onLayerMerge,

      constants.SCOPE_SET,                    this.onScopeSet,
      constants.SCOPE_COPY,                   this.onScopeCopy,
      constants.SCOPE_CUT,                    this.onScopeCut,
      constants.SCOPE_DELETE,                 this.onScopeDelete,
      constants.SCOPE_PASTE,                  this.onScopePaste,
      constants.SCOPE_FLIP_HORIZONTAL,        this.onScopeFlipHorizontal,
      constants.SCOPE_FLIP_VERTICAL,          this.onScopeFlipVertical,
      constants.SCOPE_ROTATE,                 this.onScopeRotate,

      constants.PIXEL_ADD,                    this.onPixelAdd,
      constants.PIXELS_ADD,                   this.onPixelsAdd,
      constants.PIXEL_DELETE,                 this.onPixelDelete,
      constants.PIXELS_MOVE,                  this.onPixelsMove,
      constants.PAINTBUCKET,                  this.onPaintbucket,
      constants.PREVIEW_MOVE_TOOL,            this.onPreviewMoveTool,

      constants.PIXELS_SAVE,                  this.onFileSave,

      constants.HISTORY_UNDO,                 this.onHistoryUndo,
      constants.HISTORY_REDO,                 this.onHistoryRedo
    );
  },

  getData: function() {
    return this.data;
  },

  resetData: function() {
    var data = {
      file: [],
      frame: [],
      scope: [],
      clipboard: [],
      preview: [],

      dict: {},
    };

    this.data = data;
  },

  //----------------------------------------------------------------------------
  // Action handlers
  //----------------------------------------------------------------------------

  onFileCreateAndLoad: function() {
    this.waitFor(['FileStore'], function(FileStore) {
      this.resetData();
      this.data.file = FileStore.getData().pixels;

      this.rebuildDictionary(FileStore);

      this.emit('change');
    });
  },

  onFileSave: function() {
    this.save();
    this.emit('change');
  },

  onFrameSelect: function(frame) {
    this.waitFor(['UiStore'], function(UiStore) {
      this.save();
      this.data.frame = _.filter(this.data.file, {frame: frame});
      this.emit('change');
    });
  },

  onFrameFlipHorizontal: function() {
    this.data.scope.forEach(this.flipHorizontal, this);
    this.data.frame.forEach(this.flipHorizontal, this);
    this.emit('change');
  },

  onFrameFlipVertical: function() {
    this.data.scope.forEach(this.flipVertical, this);
    this.data.frame.forEach(this.flipVertical, this);
    this.emit('change');
  },

  onFrameRotate: function(angle) {
    var s = flux.stores.FileStore.getData().size,
        pivot = new Point(
          (s.width+1)/2,
          (s.height+1)/2
        );

    this.data.scope.forEach(this.rotatePivot.bind(this, angle, pivot), this);
    this.data.frame.forEach(this.rotatePivot.bind(this, angle, pivot), this);
    this.emit('change');
  },

  onLayerDelete: function(id) {
    this.deleteLayerPixels(id);
    this.emit('change');
  },

  onLayerDrop: function(id) {
    this.waitFor(['FileStore'], function(FileStore) {

      // refresh z values of all pixels
      var layerZ = {};
      FileStore.getData().layers.forEach(function(layer) {
        layerZ[layer.id] = layer.z;
      });

      this.data.file.forEach(function(pixel) {
        pixel.z = layerZ[pixel.layer];
      });

      this.data.frame = _.filter(this.data.file, {frame: flux.stores.UiStore.getData().frames.selected});

      //this.rebuildDictionary(FileStore);

      this.emit('change');
    });
  },

  // TODO: fix bugs, pixels are getting lost here it seems
  onLayerMerge: function(payload) {
    // define find to look for top layer pixels
    var search = this.data.frame;
    if(payload.top.id === storeUtils.layers.getSelected().id) {
      search = this.data.scope;
    }

    // get pixels of top layer
    var topLayerPixels = _.filter(search, {layer: payload.top.id});

    // prepare target pixels
    var target = {
      frame: payload.bottom.frame,
      layer: payload.bottom.id,
      z: payload.bottom.z,
    };

    // add pixels to bottom layer
    topLayerPixels.forEach(function(px) {
      this.addPixel(target.frame, target.layer, px.x, px.y, target.z, px.toHex());
    }, this);

    // this.save();

    // delete pixels of top layer
    this.deleteLayerPixels(payload.top.id);

    // this.data.scope = [];

    this.emit('change');
  },

  onScopeSet: function(params) {
    this.save();

    // update pixels in scope
    if(params.oldScope !== null && this.data.scope.length > 0) {
      // merge scope pixels back to frame
      this.data.scope.forEach(function(px) {
        var oldPixel = _.find(this.data.frame, {x: px.x, y: px.y});
        if(!_.isUndefined(oldPixel)) {
          this.data.frame = this.deletePixel(this.data.frame, px.layer, px.x, px.y);
        }
        this.data.frame.push(px);
      }, this);

      this.data.scope = [];
    }

    var layer = params.type === 'layer' ? params.data : params.oldScope;
    // use selected layer if no layer data was given
    if(layer === undefined) layer = storeUtils.layers.getSelected().id;

    switch(params.type) {
      case 'selection':
        // move pixels in selection to scope
        this.data.scope = _.remove(this.data.frame, function(px) {
          return px.layer === layer && storeUtils.selection.contains(px);
        });
        break;

      case 'layer':
        // move pixels of layer to scope
        this.data.scope = _.remove(this.data.frame, {layer: layer});
        break;
    }

    this.emit('change');
    // this.log();
  },

  onScopeCopy: function() {
    this.data.clipboard = this.data.scope;
    this.emit('change');

    // this.log();
  },

  onScopeCut: function() {
    this.data.clipboard = this.data.scope;
    this.data.scope.forEach(function(px) {
      this.data.file = this.deletePixel(this.data.file, px.layer, px.x, px.y);
      this.data.scope = this.deletePixel(this.data.scope, px.layer, px.x, px.y);
      this.data.frame = this.deletePixel(this.data.frame, px.layer, px.x, px.y);
    }, this);

    this.emit('change');

    // this.log();
  },

  onScopeDelete: function() {
    this.data.scope.forEach(function(px) {
      this.data.file = this.deletePixel(this.data.file, px.layer, px.x, px.y);
      this.data.scope = this.deletePixel(this.data.scope, px.layer, px.x, px.y);
      this.data.frame = this.deletePixel(this.data.frame, px.layer, px.x, px.y);
    }, this);

    this.emit('change');

    // this.log();
  },

  onScopePaste: function() {
    // get current frame & layer
    var frame = flux.stores.UiStore.getData().frames.selected,
        layer = flux.stores.UiStore.getData().layers.selected,
        z = storeUtils.layers.getSelected().z;

    function pastePixel(px) {
      this.addPixel(frame, layer, px.x, px.y, z, px.toHex());
    }

    this.data.clipboard.forEach(pastePixel, this);
    this.emit('change');

    // this.log();
  },

  onScopeFlipHorizontal: function() {
    this.data.scope.forEach(this.flipHorizontal, this);
    this.emit('change');
  },

  onScopeFlipVertical: function() {
    this.data.scope.forEach(this.flipVertical, this);
    this.emit('change');
  },

  onScopeRotate: function(angle) {
    this.data.scope.forEach(this.rotateScope.bind(this, angle), this);
    this.emit('change');
  },

  onPixelAdd: function(payload) {
    this.addPixel(payload.frame, payload.layer, payload.x, payload.y, payload.z, payload.color);
    this.emit('change');
    // this.log();
  },

  onPixelsAdd: function(pixels) {
    self.data.scope = _.uniq(pixels.concat(self.data.scope), false, this.pixelHash);

    pixels.forEach(function(px) {
      this.writeToDictionary(px);
    }, this);

    self.emit('change');
  },

  onPixelDelete: function(payload) {
    this.data.file = this.deletePixel(this.data.file, payload.layer, payload.x, payload.y);
    this.data.scope = this.deletePixel(this.data.scope, payload.layer, payload.x, payload.y);
    this.data.frame = this.deletePixel(this.data.frame, payload.layer, payload.x, payload.y);

    delete this.data.dict[payload.frame][payload.layer][payload.x][payload.y];

    this.emit('change');

    // this.log();
  },

  onPixelsMove: function(distance) {
    var wrapPixel = function(px) { px.wrap(distance); };
    this.data.scope.forEach(wrapPixel);
    this.data.preview = [];
    this.emit('change');
  },

  onPaintbucket: function(point) {

    document.getElementById('ScreenBlocker').style.display = 'block';

    var self = this,
        brush = flux.stores.UiStore.getData().color.brush;

    var data = {
      point: point,
      pixels: this.data.scope,
      fillColor: {r: brush.red(), g: brush.green(), b: brush.blue(), a: brush.alpha()},
      frame: flux.stores.UiStore.getData().frames.selected,
      layer: flux.stores.UiStore.getData().layers.selected,
      layerZ: storeUtils.layers.getSelected().z,
    };

    // restrict bounds to selection if active
    if(storeUtils.selection.isActive) {
      data.bounds = {
        top: flux.stores.UiStore.getData().selection.start.y,
        right: flux.stores.UiStore.getData().selection.end.x,
        bottom: flux.stores.UiStore.getData().selection.end.y,
        left: flux.stores.UiStore.getData().selection.start.x,
      };
    }
    else { // or default bounds to file size
      data.bounds = {
        top: 1,
        right: flux.stores.FileStore.getData().size.width,
        bottom: flux.stores.FileStore.getData().size.height,
        left: 1,
      };
    }

    function workerDone(e) {
      var newPixels = [];

      e.data.forEach(function(p) {
        newPixels.push(new Pixel(p.frame, p.layer, p.x, p.y, p.r, p.g, p.b, p.a, p.z));
      });

      self.data.scope = _.uniq(newPixels.concat(self.data.scope), false, this.pixelHash);

      newPixels.forEach(function(pixel) {
        self.writeToDictionary(pixel);
      });

      document.getElementById('ScreenBlocker').style.display = 'none';

      stateHistory.addUndoState();
      self.emit('change');
    }

    function workerFail(e) {
      console.log('worker failed in line '+e.lineno+' with message: '+e.message);
      document.getElementById('ScreenBlocker').style.display = 'none';
      self.emit('change');
    }

    var worker = new Worker('workers/paintbucket.js');
    worker.onmessage = workerDone;
    worker.onerror = workerFail;
    worker.postMessage(data);
  },

  onPreviewMoveTool: function(payload) {
    this.data.preview = payload.pixels;
    this.emit('change');
  },

  onFrameDuplicate: function() {
    this.waitFor(['FileStore'], function(FileStore) {
      this.data.file = FileStore.getData().pixels;
      this.emit('change');
    });
  },

  onHistoryUndo: function() {
    var pixels = stateHistory.last.pixels[stateHistory.undoPointer];
    this.data.dict = pixels;
    this.emit('change');
  },

  onHistoryRedo: function() {
    var pixels = stateHistory.last.pixels[stateHistory.undoPointer];
    this.data.dict = pixels;
    this.emit('change');
  },

  //----------------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------------

  log: function() {
    console.log('clipboard: '+this.data.clipboard.length+' '+
                'scope: '+this.data.scope.length+' '+
                'frame: '+this.data.frame.length);
  },

  deletePixel: function(pixels, layer, x, y) {
    return pixels.filter(function(px) {
      return !(px.layer == layer && px.x == x && px.y == y);
    });
  },

  deleteLayerPixels: function(layer) {
    this.data.file = this.data.file.filter(function(pixel) {
      return pixel.layer !== layer;
    });
    this.data.frame = _.filter(this.data.file, {frame: flux.stores.UiStore.getData().frames.selected});
  },

  addPixel: function(frame, layer, x, y, z, color) {
    // add pixel to scope / replace pixel in scope
    var c = new Color(color),
        a = 1;

    var newPixel = new Pixel(frame, layer, x, y, c.red(), c.green(), c.blue(), a, z);
    var oldPixel = _.find(this.data.scope, {x: x, y: y});
    if(_.isUndefined(oldPixel)) {
      // console.log('filling pixel', layer, x, y, c.rgbString());
      this.data.scope.push(newPixel);
    }
    else {
      // console.log('replacing pixel', layer, x, y, c.rgbString());
      // replace old pixel
      for(var i = 0; i < this.data.scope.length; i++) {
        var p = this.data.scope[i];
        if(p.x == x && p.y == y) {
          p.r = c.red();
          p.g = c.green();
          p.b = c.blue();
          p.a = a;
          break;
        }
      }
    }

    this.writeToDictionary(newPixel);
  },

  flipHorizontal: function(pixel) {
    return pixel.flipHorizontal();
  },

  flipVertical: function(pixel) {
    return pixel.flipVertical();
  },

  rotatePivot: function(angle, pivot, pixel) {
    return pixel.rotate(angle, pivot);
  },

  rotateScope: function(angle, pixel) {
    return pixel.rotate(angle);
  },

  merge: function(from, to) {
    this.data[from].forEach(function(px) {
      this.data[to].push(px);
    }, this);
    this.data[to] = _.uniq(this.data[to], false, this.pixelHash);
  },

  save: function() {
    this.merge('scope', 'file');
    this.merge('frame', 'file');
  },

  pixelHash: function(px) {
    return px.hash;
  },

  writeToDictionary: function(pixel) {
    if(undefined === this.data.dict[pixel.frame]) this.data.dict[pixel.frame] = {};
    if(undefined === this.data.dict[pixel.frame][pixel.layer]) this.data.dict[pixel.frame][pixel.layer] = {};
    if(undefined === this.data.dict[pixel.frame][pixel.layer][pixel.x]) this.data.dict[pixel.frame][pixel.layer][pixel.x] = {};
    if(undefined === this.data.dict[pixel.frame][pixel.layer][pixel.x][pixel.y]) this.data.dict[pixel.frame][pixel.layer][pixel.x][pixel.y] = {};

    this.data.dict[pixel.frame][pixel.layer][pixel.x][pixel.y] = pixel;
  },

  rebuildDictionary: function(FileStore) {
    this.data.dict = {};

    FileStore.getData().pixels.forEach(function(px) {
      this.writeToDictionary(px);
    }, this);
  },
});

// module.exports = new PixelStore();
