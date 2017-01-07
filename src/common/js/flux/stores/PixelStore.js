// requires
// constants
// flux
// stateHistory
// storeUtils


var PixelStore = Fluxxor.createStore({
  initialize: function() {
    this.resetData();
    this.bindActions(
      constants.FILE_LOAD,                    this.onFileCreateAndLoad,
      constants.FILE_CREATE,                  this.onFileCreateAndLoad,
      constants.FILE_SIZE,                    this.onFileCreateAndLoad,

      constants.FRAME_FLIP_HORIZONTAL,        this.onFrameFlipHorizontal,
      constants.FRAME_FLIP_VERTICAL,          this.onFrameFlipVertical,
      constants.FRAME_DUPLICATE,              this.onFrameDuplicate,
      constants.FRAME_ROTATE,                 this.onFrameRotate,

      constants.LAYER_DELETE,                 this.onLayerDelete,
      constants.LAYER_MERGE,                  this.onLayerMerge,

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

      constants.HISTORY_UNDO,                 this.onHistoryUndo,
      constants.HISTORY_REDO,                 this.onHistoryRedo
    );
  },

  getData: function() {
    return this.data;
  },

  resetData: function() {
    var data = {
      file: [], // deprecated
      frame: [], // deprecated
      scope: [], // deprecated

      preview: [],
      clipboard: [],
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
      this.rebuildDictionary(FileStore);
      this.emit('change');
    });
  },

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

  onScopeCopy: function() {
    var layer = storeUtils.layers.getSelected(),
        pixels = this._scopeToArray(layer);
    this.data.clipboard = pixels;
    this.emit('change');
  },

  onScopeCut: function() {
    var layer = storeUtils.layers.getSelected(),
        pixels = this._scopeToArray(layer);
    this.data.clipboard = pixels;
    pixels.forEach(this.deletePixel, this);
    this.emit('change');
  },

  onScopeDelete: function() {
    var layer = storeUtils.layers.getSelected(),
        pixels = this._scopeToArray(layer);
    pixels.forEach(this.deletePixel, this);
    this.emit('change');
  },

  onScopePaste: function() {
    var frame = storeUtils.frames.getSelected(),
        layer = storeUtils.layers.getSelected();

    function pastePixel(px) {
      this.addPixel(frame, layer.id, px.x, px.y, px.toHex());
    }

    this.data.clipboard.forEach(pastePixel, this);
    this.emit('change');
  },

  onScopeFlipHorizontal: function() {
    this.manipulateScopePixels(this.flipHorizontal);
    this.emit('change');
  },

  onScopeFlipVertical: function() {
    this.manipulateScopePixels(this.flipVertical);
    this.emit('change');
  },

  onScopeRotate: function(angle) {
    this.manipulateScopePixels(this.rotateScope.bind(this, angle));
    this.emit('change');
  },

  onPixelAdd: function(payload) {
    this.addPixel(payload.frame, payload.layer, payload.x, payload.y, payload.color);
    this.emit('change');
  },

  onPixelsAdd: function(pixels) {
    this.addPixels(pixels);
    this.emit('change');
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

  deletePixel: function(pixel) {
    delete this.data.dict[pixel.frame][pixel.layer][pixel.x][pixel.y];
  },

  addPixel: function(frame, layer, x, y, color) {
    var c = new Color(color),
        a = 1,
        newPixel = new Pixel(frame, layer, x, y, c.red(), c.green(), c.blue(), a);
    this.writeToDictionary(newPixel);
  },

  addPixels: function(pixels) {
    pixels.forEach(function(px) {
      this.writeToDictionary(px);
    }, this);
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

  _scopeToArray: function(layer) {
    var frame = layer.frame,
        xValues, x, xValue,
        yValues, y, yValue,
        pixel, pixels = [];

    xValues = Object.keys(this.data.dict[frame][layer.id]);
    xlen = xValues.length;

    // TODO: consider selection
    for(x = 0; x < xlen; x++) {
      xValue = xValues[x];

      yValues = Object.keys(this.data.dict[frame][layer.id][xValue]);
      ylen = yValues.length;

      for(y = 0; y < ylen; y++) {
        yValue = yValues[y];
        pixel = this.data.dict[frame][layer.id][xValue][yValue];
        pixels.push(pixel);
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

  manipulateScopePixels: function(callback) {
    var frame = storeUtils.frames.getSelected(),
        layer = storeUtils.layers.getSelected(),
        pixels = this._scopeToArray(layer);

    delete this.data.dict[frame][layer.id];
    pixels.forEach(callback, this);
    pixels.forEach(function(pixel) {
      this.writeToDictionary(pixel);
    }, this);

    this.emit('change');
  },
});

// module.exports = new PixelStore();
