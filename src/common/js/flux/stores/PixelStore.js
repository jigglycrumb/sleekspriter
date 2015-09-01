var PixelStore = Fluxxor.createStore({
  initialize: function() {
    this.resetData();
    this.bindActions(
      constants.FILE_LOAD,                    this.onFileLoad,
      constants.FRAME_SELECT,                 this.onFrameSelect,
      constants.LAYER_DELETE,                 this.onLayerDelete,
      constants.LAYER_DROP,                   this.onLayerDrop,
      constants.SCOPE_SET,                    this.onScopeSet,
      constants.SCOPE_COPY,                   this.onScopeCopy,
      constants.PIXEL_ADD,                    this.onPixelAdd,
      constants.PIXEL_DELETE,                 this.onPixelDelete,
      constants.PIXELS_MOVE,                  this.onPixelsMove
    );
  },

  getData: function() {
    return this.data;
  },

  resetData: function(key) {
    var data = {
      file: [],
      frame: [],
      scope: [],
      clipboard: [],
      preview: [],
    };

    if(key && data[key]) this.data[key] = data[key];
    else this.data = data;
  },


  onFileLoad: function() {
    this.waitFor(['FileStore'], function(FileStore) {
      this.data.file = FileStore.getData().pixels;
      this.emit('change');
    });
  },

  onFrameSelect: function(frame) {
    this.waitFor(['UiStore'], function(UiStore) {
      this.data.frame = _.where(this.data.file, {frame: frame});
      this.emit('change');
    });
  },

  onLayerDelete: function(id) {
    this.data.file = this.data.file.filter(function(pixel) {
      return pixel.layer !== id;
    });
    this.data.frame = _.where(this.data.file, {frame: flux.stores.UiStore.getData().frames.selected});
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

      this.data.frame = _.where(this.data.file, {frame: flux.stores.UiStore.getData().frames.selected});
      this.emit('change');
    });
  },

  onScopeSet: function(params) {
    console.log(params);

    // update pixels in scope
    if(params.oldScope !== null && this.data.scope.length > 0) {
      // merge scope pixels back to frame
      this.data.scope.forEach(function(px) {
        var oldPixel = _.findWhere(this.data.frame, {x: px.x, y: px.y});
        if(!_.isUndefined(oldPixel)) {
          this.data.frame = this._deletePixel(this.data.frame, px.layer, px.x, px.y);
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
    this._logPixels();
  },

  onScopeCopy: function() {
    this.data.clipboard = this.data.scope;
    this.emit('change');

    this._logPixels();
  },

  onPixelAdd: function(payload) {

    // add pixel to scope / replace pixel in scope
    var c = new Color(payload.color),
        a = 1;

    var newPixel = new Pixel(payload.frame, payload.layer, payload.x, payload.y, c.red(), c.green(), c.blue(), a, payload.z);
    var oldPixel = _.findWhere(this.data.scope, {x: payload.x, y: payload.y});
    if(_.isUndefined(oldPixel)) {
      console.log('filling pixel', payload.layer, payload.x, payload.y, c.rgbString());
      this.data.scope.push(newPixel);
    }
    else {
      console.log('replacing pixel', payload.layer, payload.x, payload.y, c.rgbString());
      // replace old pixel
      for(var i = 0; i < this.data.scope.length; i++) {
        var p = this.data.scope[i];
        if(p.x == payload.x && p.y == payload.y) {
          p.r = c.red();
          p.g = c.green();
          p.b = c.blue();
          p.a = a;
          break;
        }
      }
    }

    this.emit('change');

    this._logPixels();
  },

  onPixelDelete: function(payload) {
    this.data.file = this._deletePixel(this.data.file, payload.layer, payload.x, payload.y);
    this.data.scope = this._deletePixel(this.data.scope, payload.layer, payload.x, payload.y);
    this.data.frame = this._deletePixel(this.data.frame, payload.layer, payload.x, payload.y);

    this.emit('change');

    this._logPixels();
  },

  onPixelsMove: function(distance) {
    var wrapPixel = function(px) { px.wrap(distance) };
    this.data.scope.forEach(wrapPixel);
    this.emit('change');
  },

  _logPixels: function() {
    console.log('clipboard: '+this.data.clipboard.length+' '+
                'scope: '+this.data.scope.length+' '+
                'frame: '+this.data.frame.length);
  },

  _deletePixel: function(pixels, layer, x, y) {
    return pixels.filter(function(px) {
      return !(px.layer == layer && px.x == x && px.y == y);
    });
  },

});