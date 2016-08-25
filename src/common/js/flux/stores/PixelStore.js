var PixelStore = Fluxxor.createStore({
  initialize: function() {
    this.resetData();
    this.bindActions(
      constants.FILE_LOAD,                    this.onFileCreateAndLoad,
      constants.FILE_CREATE,                  this.onFileCreateAndLoad,
      // constants.FILE_SAVE,                    this.onFileSave,
      // constants.FILE_SAVE_AS,                 this.onFileSave,
      // constants.FILE_SIZE,                    this.onFileSave,

      // constants.FRAME_SELECT,                 this.onFrameSelect,
      constants.FRAME_FLIP_HORIZONTAL,        this.onFrameFlipHorizontal,
      constants.FRAME_FLIP_VERTICAL,          this.onFrameFlipVertical,
      constants.FRAME_DUPLICATE,              this.onFrameDuplicate,
      constants.FRAME_ROTATE,                 this.onFrameRotate,

      constants.LAYER_DELETE,                 this.onLayerDelete,
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

      // constants.PIXELS_SAVE,                  this.onFileSave,

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
      // this.data.file = FileStore.getData().pixels;

      this.rebuildDictionary(FileStore);

      this.emit('change');
    });
  },

  // onFileSave: function() {
  //   this.save();
  //   this.emit('change');
  // },
  //
  // onFrameSelect: function(frame) {
  //   this.waitFor(['UiStore'], function(UiStore) {
  //     this.save();
  //     this.data.frame = _.filter(this.data.file, {frame: frame});
  //     this.emit('change');
  //   });
  // },

  onFrameFlipHorizontal: function() {
    this.manipulateFramePixels(this.flipHorizontal);
  },

  onFrameFlipVertical: function() {
    this.manipulateFramePixels(this.flipVertical);
  },

  onFrameRotate: function(angle) {
    var s = flux.stores.FileStore.getData().size,
        pivot = new Point(
          (s.width+1)/2,
          (s.height+1)/2
        );

    this.manipulateFramePixels(this.rotatePivot.bind(this, angle, pivot));
  },

  onLayerDelete: function(id) {
    delete this.data.dict[flux.stores.UiStore.getData().frames.selected][id];
    this.emit('change');
  },

  onLayerMerge: function(payload) {

    var frame = payload.top.frame,
        topLayer = payload.top.id,
        bottomLayer = payload.bottom.id,
        xValues = Object.keys(this.data.dict[frame][topLayer]),
        xlen = xValues.length,
        pixel;

    for(x = 0; x < xlen; x++) {
      xValue = xValues[x];

      yValues = Object.keys(this.data.dict[frame][topLayer][xValue]);
      ylen = yValues.length;

      for(y = 0; y < ylen; y++) {
        yValue = yValues[y];
        pixel = this.data.dict[frame][topLayer][xValue][yValue].clone();
        pixel.layer = bottomLayer;
        this.writeToDictionary(pixel);
      }
    }

    // delete pixels of top layer
    delete this.data.dict[frame][topLayer];

    this.emit('change');
  },

  onScopeSet: function(params) {
    // this.save();

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
  },

  onScopeCopy: function() {
    this.data.clipboard = this.data.scope;
    this.emit('change');
  },

  onScopeCut: function() {
    this.data.clipboard = this.data.scope;
    this.data.scope.forEach(function(px) {
      this.data.file = this.deletePixel(this.data.file, px.layer, px.x, px.y);
      this.data.scope = this.deletePixel(this.data.scope, px.layer, px.x, px.y);
      this.data.frame = this.deletePixel(this.data.frame, px.layer, px.x, px.y);
    }, this);

    this.emit('change');
  },

  onScopeDelete: function() {
    this.data.scope.forEach(function(px) {
      this.data.file = this.deletePixel(this.data.file, px.layer, px.x, px.y);
      this.data.scope = this.deletePixel(this.data.scope, px.layer, px.x, px.y);
      this.data.frame = this.deletePixel(this.data.frame, px.layer, px.x, px.y);
    }, this);

    this.emit('change');
  },

  onScopePaste: function() {
    // get current frame & layer
    var frame = flux.stores.UiStore.getData().frames.selected,
        layer = flux.stores.UiStore.getData().layers.selected,
        z = storeUtils.layers.getSelected().z;

    function pastePixel(px) {
      this.addPixel(frame, layer, px.x, px.y, px.toHex());
    }

    this.data.clipboard.forEach(pastePixel, this);
    this.emit('change');
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
    //this.data.scope.forEach(this.rotateScope.bind(this, angle), this);
    console.log('PixelStore.onScopeRotate');
    this.emit('change');
  },

  onPixelAdd: function(payload) {
    this.addPixel(payload.frame, payload.layer, payload.x, payload.y, payload.color);
    this.emit('change');
  },

  onPixelsAdd: function(pixels) {
    pixels.forEach(function(px) {
      this.writeToDictionary(px);
    }, this);

    self.emit('change');
  },

  onPixelDelete: function(payload) {
    delete this.data.dict[payload.frame][payload.layer][payload.x][payload.y];
    this.emit('change');
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
        newPixels.push(new Pixel(p.frame, p.layer, p.x, p.y, p.r, p.g, p.b, p.a));
      });

      newPixels.forEach(function(pixel) {
        self.writeToDictionary(pixel);
      });

      document.getElementById('ScreenBlocker').style.display = 'none';

      stateHistory.addUndoState();
      self.emit('change');
    }

    function workerFail(e) {
      console.error('worker failed in line '+e.lineno+' with message: '+e.message);
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

  onFrameDuplicate: function(payload) {
    this.waitFor(['FileStore'], function(FileStore) {
      // this.data.file = FileStore.getData().pixels;

      // duplicate pixels
      console.log('PixelStore.onFrameDuplicate', payload);
      this.rebuildDictionary(FileStore);
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

  // log: function() {
  //   console.log('clipboard: '+this.data.clipboard.length+' '+
  //               'scope: '+this.data.scope.length+' '+
  //               'frame: '+this.data.frame.length);
  // },

  deletePixel: function(pixels, layer, x, y) {
    return pixels.filter(function(px) {
      return !(px.layer == layer && px.x == x && px.y == y);
    });
  },

  addPixel: function(frame, layer, x, y, color) {
    var c = new Color(color),
        a = 1,
        newPixel = new Pixel(frame, layer, x, y, c.red(), c.green(), c.blue(), a);
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

  _dictToArray: function(dict) {
    var flen, llen, xlen, ylen,
        frames, f, frame,
        layers, l, layer,
        xValues, x, xValue,
        yValues, y, yValue,
        pixel, pixels;

    pixels = [];

    frames = Object.keys(dict);
    flen = frames.length;

    for(f = 0; f < flen; f++) {
      frame = frames[f];

      layers = Object.keys(dict[frame]);
      llen = layers.length;

      for(l = 0; l < llen; l++) {
        layer = layers[l];

        xValues = Object.keys(dict[frame][layer]);
        xlen = xValues.length;

        for(x = 0; x < xlen; x++) {
          xValue = xValues[x];

          yValues = Object.keys(dict[frame][layer][xValue]);
          ylen = yValues.length;

          for(y = 0; y < ylen; y++) {
            yValue = yValues[y];
            pixel = dict[frame][layer][xValue][yValue];
            pixels.push(pixel);
          }
        }
      }
    }

    return pixels;
  },

  _frameToArray: function(frame) {
    var llen, xlen, ylen,
        layers, l, layer,
        xValues, x, xValue,
        yValues, y, yValue,
        pixel, pixels;

    pixels = [];
    layers = Object.keys(this.data.dict[frame]);
    llen = layers.length;

    for(l = 0; l < llen; l++) {
      layer = layers[l];

      xValues = Object.keys(this.data.dict[frame][layer]);
      xlen = xValues.length;

      for(x = 0; x < xlen; x++) {
        xValue = xValues[x];

        yValues = Object.keys(this.data.dict[frame][layer][xValue]);
        ylen = yValues.length;

        for(y = 0; y < ylen; y++) {
          yValue = yValues[y];
          pixel = this.data.dict[frame][layer][xValue][yValue];
          pixels.push(pixel);
        }
      }
    }

    return pixels;
  },

  manipulateFramePixels: function(callback) {
    var frame = storeUtils.frames.getSelected(),
        pixels = this._frameToArray(frame);

    delete this.data.dict[frame];
    pixels.forEach(callback, this);
    pixels.forEach(function(pixel) {
      this.writeToDictionary(pixel);
    }, this);

    this.emit('change');
  },

});

// module.exports = new PixelStore();
