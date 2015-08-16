var UiStore = Fluxxor.createStore({
  initialize: function() {
    this.resetData();
    this.bindActions(
      constants.FILE_LOAD,                  this.onFileLoad,
      constants.TAB_SELECT,                 this.onTabSelect,
      constants.TOOL_SELECT,                this.onToolSelect,
      constants.SETTINGS_PAINT,             this.onSettingsPaint,
      constants.SETTINGS_GRID,              this.onSettingsGrid,
      constants.ZOOM_SELECT,                this.onZoomSelect,
      constants.BACKGROUND_SELECT,          this.onBackgroundSelect,
      constants.FRAME_SELECT,               this.onFrameSelect,
      constants.MODAL_SHOW,                 this.onModalShow,
      constants.MODAL_HIDE,                 this.onModalHide,
      constants.BRIGHTNESSTOOL_MODE,        this.onBrightnessToolMode,
      constants.BRIGHTNESSTOOL_INTENSITY,   this.onBrightnessToolIntensity,
      constants.CURSOR_SET,                 this.onCursorSet,
      constants.COLOR_BRUSH,                this.onColorBrush,
      constants.COLOR_LAYER,                this.onColorLayer,
      constants.COLOR_FRAME,                this.onColorFrame,
      constants.PALETTE_LOAD,               this.onPaletteLoad,
      constants.PALETTE_SELECT,             this.onPaletteSelect,

      constants.LAYER_SELECT,               this.onLayerSelect,
      constants.LAYER_VISIBILITY,           this.onLayerAttributeChange,
      constants.LAYER_OPACITY,              this.onLayerAttributeChange,
      constants.LAYER_NAME,                 this.onLayerAttributeChange,
      constants.LAYER_TOP_SELECT,           this.onLayerTopSelect,
      constants.LAYER_ADD,                  this.onLayerAdd,
      constants.LAYER_DELETE,               this.onLayerDelete,
      constants.LAYER_DROP,                 this.onLayerDrop,

      constants.ANIMATION_SELECT,           this.onAnimationSelect,
      constants.ANIMATION_DELETE,           this.onAnimationDelete,
      constants.ANIMATION_FRAME_SELECT,     this.onAnimationFrameSelect,

      constants.EXPORT_PART,                this.onExportPart,
      constants.EXPORT_FRAME,               this.onExportFrame,
      constants.EXPORT_ANIMATION,           this.onExportAnimation,
      constants.EXPORT_ZOOM,                this.onExportZoom,
      constants.EXPORT_FORMAT,              this.onExportFormat,
      constants.EXPORT_STATUS,              this.onExportStatus,
      constants.SCOPE_SET,                  this.onScopeSet
    );
  },

  getData: function(key) {
    if(key && this.data[key]) return this.data[key];
    else return this.data;
  },

  resetData: function(key) {
    var data = {
      tab: 'start',
      tool: 'BrushTool',
      modal: {
        visible: false,
        component: null,
        data: null,
      },
      frames: {
        selected: 1,
        total: 1,
      },
      layers: {
        selected: null,
        frame: [],
      },
      pixels: {
        frame: [],
        scope: [],
        clipboard: [],
      },
      settings: {
        paint: false,
        grid: true,
      },
      zoom: {
        min: 1,
        max: 50,
        selected: 10,
      },
      background: {
        type: 'pattern',
        value: 'checkerboard',
      },
      offset: {
        top: 40,
        right: 205,
        bottom: 27,
        left: 45,
      },
      brightnessTool: {
        mode: 'lighten',
        intensity: 10,
      },
      cursor: new Point(1,1),
      color: {
        brush: new Color('#000000'),
        layer: new Color('#000000'),
        frame: new Color('#000000'),
      },
      palettes: {
        selected: 0,
        available: [{"id": "sprite", "title": "Sprite colours", "short": "Sprite", "colors": []}],
      },
      animations: {
        selected: null,
        frame: null,
      },
      export: {
        part: 'spritesheet',
        frame: 1,
        animation: null,
        zoom: 1,
        format: 'png',
        status: '',
      },
    };

    if(key && data[key]) this.data[key] = data[key];
    else this.data = data;
  },

  onFileLoad: function(payload) {
    this.waitFor(['FileStore'], function(FileStore) {
      this.data.frames.selected = 1;
      this.data.frames.total = FileStore.getData('frames').x * FileStore.getData('frames').y;

      this.data.layers.frame = storeUtils.layers.getByFrame(1);

      this.data.pixels.frame = [];
      this.data.pixels.scope = [];

      this._buildSpritePalette(FileStore);
      this.emit('change');
    });
  },

  onTabSelect: function(tab) {
    this.data.tab = tab;
    this.emit('change');
  },

  onToolSelect: function(tool) {
    this.data.tool = tool;
    this.emit('change');
  },

  onSettingsPaint: function(visible) {
    this.data.settings.paint = !!visible;
    this.emit('change');
  },

  onSettingsGrid: function(visible) {
    this.data.settings.grid = !!visible;
    this.emit('change');
  },

  onZoomSelect: function(zoom) {
    var z = parseInt(zoom);
    z = z > this.data.zoom.max ? this.data.zoom.max : z;
    z = z < this.data.zoom.min ? this.data.zoom.min : z;
    this.data.zoom.selected = z;
    this.emit('change');
  },

  onBackgroundSelect: function(payload) {
    this.data.background.type   = payload.type;
    this.data.background.value  = payload.value;
    this.emit('change');
  },

  onFrameSelect: function(frame) {
    frame = parseInt(frame);
    this.waitFor(['FileStore'], function(FileStore) {
      this.data.frames.selected = frame;
      this.data.layers.frame = storeUtils.layers.getByFrame(frame);
      this.data.pixels.frame = _.where(FileStore.getData('pixels'), {frame: frame});
      this.emit('change');
    });
  },

  onModalShow: function(payload) {
    this.data.modal = payload;
    this.emit('change');
  },

  onModalHide: function() {
    this.resetData('modal');
    this.emit('change');
  },

  onBrightnessToolMode: function(mode) {
    this.data.brightnessTool.mode = mode;
    this.emit('change');
  },

  onBrightnessToolIntensity: function(intensity) {
    this.data.brightnessTool.intensity = parseInt(intensity);
    this.emit('change');
  },

  onCursorSet: function(position) {
    this.data.cursor = position;
    this.emit('change');
  },

  onColorBrush: function(hexcode) {
    this.data.color.brush = new Color(hexcode);
    this.emit('change');
  },

  onColorLayer: function(hexcode) {
    this.data.color.layer = new Color(hexcode);
    this.emit('change');
  },

  onColorFrame: function(hexcode) {
    this.data.color.frame = new Color(hexcode);
    this.emit('change');
  },

  onPaletteLoad: function(palettes) {
    var self = this;
    palettes.forEach(function(palette) {
      self.data.palettes.available.push(palette);
    });
    this.emit('change');
  },

  onPaletteSelect: function(palette) {
    this.data.palettes.selected = parseInt(palette)
    this.emit('change');
  },

  onLayerSelect: function(layer) {
    this.data.layers.selected = parseInt(layer);
    this.emit('change');
  },

  onLayerAttributeChange: function() {
    this.waitFor(['FileStore'], function(FileStore) {
      this.data.layers.frame = storeUtils.layers.getByFrame(this.data.frames.selected);
      this.emit('change');
    });
  },

  onLayerTopSelect: function() {
    var layer = storeUtils.layers.getTop();
    if(layer) {
      this.data.layers.selected = layer.id;
      this.emit('change');
    }
  },

  onLayerAdd: function() {
    this.waitFor(['FileStore'], function(FileStore) {
      this.data.layers.frame = _.where(FileStore.getData().layers, {frame: this.data.frames.selected});
      this.emit('change');
    });
  },

  onLayerDelete: function(id) {
    this.waitFor(['FileStore'], function(FileStore) {
      this.data.layers.frame = _.where(FileStore.getData().layers, {frame: this.data.frames.selected});
      this.data.pixels.frame = _.where(FileStore.getData().pixels, {frame: this.data.frames.selected});
      this.emit('change');
    });
  },

  onLayerDrop: function(id) {
    this.waitFor(['FileStore'], function(FileStore) {
      this.data.layers.frame = _.where(FileStore.getData().layers, {frame: this.data.frames.selected});
      this.data.pixels.frame = _.where(FileStore.getData().pixels, {frame: this.data.frames.selected});
      this.emit('change');
    });
  },

  onAnimationSelect: function(id) {
    this.data.animations.selected = id;
    this.emit('change');
  },

  onAnimationDelete: function() {
    this.data.animations.selected = null;
    this.emit('change');
  },

  onAnimationFrameSelect: function(position) {
    this.data.animations.frame = position;
    this.emit('change');
  },

  onExportPart: function(part) {
    this.data.export.part = part;
    this.emit('change');
  },

  onExportFrame: function(frame) {
    this.data.export.frame = parseInt(frame);
    this.emit('change');
  },

  onExportAnimation: function(animation) {
    this.data.export.animation = parseInt(animation);
    this.emit('change');
  },

  onExportZoom: function(zoom) {
    this.data.export.zoom = parseInt(zoom);
    this.emit('change');
  },

  onExportFormat: function(format) {
    this.data.export.format = format;
    this.emit('change');
  },

  onExportStatus: function(text) {
    this.data.export.status = text;
    this.emit('change');
  },

  onScopeSet: function(params) {
    console.log(params);

    // update pixels in scope
    if(params.oldScope !== null && this.data.pixels.scope.length > 0) {
      // merge scope pixels back to frame
      this.data.pixels.scope.forEach(function(px) {
        var oldPixel = _.findWhere(this.data.pixels.frame, {x: px.x, y: px.y});
        if(!_.isUndefined(oldPixel)) {
          this._deletePixel(this.data.pixels.frame, px.layer, px.x, px.y);
        }
        this.data.pixels.frame.push(px);
      }, this);

      this.data.pixels.scope = [];
    }

    var layer = params.type === 'layer' ? params.data : params.oldScope;
    // use selected layer if no layer data was given
    if(layer === undefined) layer = this.data.layers.selected;

    switch(params.type) {
      case 'selection':
        // move pixels in selection to scope
        this.data.pixels.scope = _.remove(this.data.pixels.frame, function(px) {
          // return px.layer === layer && editor.selection.contains(px); // TODO
        });
        break;

      case 'layer':
        // move pixels of layer to scope
        this.data.pixels.scope = _.remove(this.data.pixels.frame, {layer: layer});
        break;
    }

    this._logPixels();

    this.emit('change');
  },

  _buildSpritePalette: function(FileStore) {
      var palette = [],
          pixels  = FileStore.getData('pixels');

      pixels.forEach(function(px) {
        palette.push(px.toHex());
      });

      this.data.palettes.available[0].colors = _.unique(palette, false);
  },

  _logPixels: function() {
    console.log('clipboard: '+this.data.pixels.clipboard.length+' '+
                'scope: '+this.data.pixels.scope.length+' '+
                'frame: '+this.data.pixels.frame.length);
  },

  _deletePixel: function(pixels, layer, x, y) {
    pixels = pixels.filter(function(px) {
      return !(px.layer == layer && px.x == x && px.y == y);
    });
  },


});