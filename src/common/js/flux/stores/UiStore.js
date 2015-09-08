var UiStore = Fluxxor.createStore({
  initialize: function() {
    this.resetData();
    this.bindActions(
      constants.FILE_LOAD,                  this.onFileLoad,
      constants.FILE_CREATE,                this.onFileLoad,

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

      constants.SELECTION_START,            this.onSelectionStart,
      constants.SELECTION_RESIZE,           this.onSelectionResize,
      constants.SELECTION_PREVIEW,          this.onSelectionPreview,
      constants.SELECTION_END,              this.onSelectionEnd,
      constants.SELECTION_CLEAR,            this.onSelectionClear,
      constants.SELECTION_MOVE,             this.onSelectionMove,

      constants.PIXEL_ADD,                  this.onPixelAdd,
      constants.PIXEL_DELETE,               this.onPixelDelete
    );
  },

  getData: function(key) {
    if(key && this.data[key]) return this.data[key];
    else return this.data;
  },

  resetData: function(key) {
    var data = {
      animations: {
        selected: null,
        frame: null,
      },
      background: {
        type: 'pattern',
        value: 'checkerboard',
      },
      brightnessTool: {
        mode: 'lighten',
        intensity: 10,
      },
      color: {
        brush: new Color('#000000'),
        layer: new Color('#000000'),
        frame: new Color('#000000'),
      },
      cursor: new Point(1,1),
      export: {
        part: 'spritesheet',
        frame: 1,
        animation: null,
        zoom: 1,
        format: 'png',
        status: '',
      },
      frames: {
        selected: 1,
        total: 1,
      },
      layers: {
        selected: null,
        frame: [],
      },
      modal: {
        visible: false,
        component: null,
        data: null,
      },
      offset: {
        top: 40,
        right: 205,
        bottom: 27,
        left: 45,
      },
      palettes: {
        selected: 0,
        available: [{'id': 'sprite', 'title': 'Sprite colours', 'short': 'Sprite', 'colors': []}],
      },
      selection: {
        start: null,
        end: null,
        cursor: null,
        distance: null,
      },
      settings: {
        paint: false,
        grid: true,
      },
      tab: 'start',
      tool: 'BrushTool',
      zoom: {
        min: 1,
        max: 50,
        selected: 10,
      },
    };

    if(key && data[key]) this.data[key] = data[key];
    else this.data = data;
  },

  //----------------------------------------------------------------------------
  // Action handlers
  //----------------------------------------------------------------------------

  onFileLoad: function(payload) {
    this.waitFor(['FileStore'], function(FileStore) {

      this.data.frames.selected = 1;
      this.data.frames.total = FileStore.getData('frames').x * FileStore.getData('frames').y;
      this.data.layers.frame = storeUtils.layers.getByFrame(1);

      // build sprite palette
      var palette = [],
          pixels  = FileStore.getData('pixels');

      pixels.forEach(function(px) { palette.push(px.toHex()); });

      this.data.palettes.available[0].colors = _.unique(palette, false);

      enableMenus(true);

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
    this.data.frames.selected = frame;
    this.data.layers.frame = storeUtils.layers.getByFrame(frame);
    this.emit('change');
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
      this.emit('change');
    });
  },

  onLayerDrop: function(id) {
    this.waitFor(['FileStore'], function(FileStore) {
      this.data.layers.frame = _.where(FileStore.getData().layers, {frame: this.data.frames.selected});
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

  onSelectionStart: function(point) {
    this.data.selection.start = point;
    this.emit('change');
  },

  onSelectionResize: function(point) {
    this.data.selection.cursor = point;
    this.emit('change');
  },

  onSelectionPreview: function(point) {
    this.data.selection.distance = point;
    this.emit('change');
  },

  onSelectionEnd: function(point) {
    this.data.selection.cursor = null;
    this.data.selection.distance = null;
    this.data.selection.end = point;

    // switch start & end if start is more "lower right" than end
    // makes calculations with the selection easier later
    if(this.data.selection.start.x > this.data.selection.end.x
    || this.data.selection.start.y > this.data.selection.end.y) {
      var temp = this.data.selection.start;
      this.data.selection.start = this.data.selection.end;
      this.data.selection.end = temp;
    }

    this.emit('change');
  },

  onSelectionClear: function() {
    this.data.selection.start = null;
    this.data.selection.end   = null;
    this.data.selection.cursor = null;
    this.data.selection.distance = null;

    this.emit('change');
  },

  onSelectionMove: function(distance) {
    this.data.selection.start = new Point(
      this.data.selection.start.x + distance.x,
      this.data.selection.start.y + distance.y
    );

    this.data.selection.end = new Point(
      this.data.selection.end.x + distance.x,
      this.data.selection.end.y + distance.y
    );

    this.emit('change');
  },

  onPixelAdd: function(payload) {
    this.data.palettes.available[0].colors.push(payload.color);
    this.data.palettes.available[0].colors = _.unique(this.data.palettes.available[0].colors, false);
    this.emit('change');
  },

  onPixelDelete: function(payload) {
    this.waitFor(['PixelStore'], function(PixelStore) {
      var palette = [],
          pixels  = PixelStore.getData();

      for(x in pixels) {
        var pixelArr = pixels[x];
        pixelArr.forEach(function(px) { palette.push(px.toHex()); });
      }

      this.data.palettes.available[0].colors = _.unique(palette, false);
      this.emit('change');
    });
  },

});