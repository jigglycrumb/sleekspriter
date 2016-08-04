var UiStore = Fluxxor.createStore({
  initialize: function() {
    this.resetData();
    this.bindActions(
      constants.FILE_LOAD,                  this.onFileLoad,
      constants.FILE_CREATE,                this.onFileLoad,
      constants.FILE_SIZE,                  this.onFileSize,

      constants.TAB_SELECT,                 this.onTabSelect,
      constants.TOOL_SELECT,                this.onToolSelect,
      constants.SETTINGS_GRID,              this.onSettingsGrid,
      constants.ZOOM_SELECT,                this.onZoomSelect,
      constants.FRAME_SELECT,               this.onFrameSelect,
      constants.MODAL_SHOW,                 this.onModalShow,
      constants.MODAL_HIDE,                 this.onModalHide,
      constants.MENU_SHOW,                  this.onMenuShow,
      constants.MENU_HIDE,                  this.onMenuHide,
      constants.BRIGHTNESSTOOL_MODE,        this.onBrightnessToolMode,
      constants.BRIGHTNESSTOOL_INTENSITY,   this.onBrightnessToolIntensity,
      constants.COLOR_BRUSH,                this.onColorBrush,
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
      constants.ANIMATION_PLAY,             this.onAnimationPlay,
      constants.ANIMATION_PAUSE,            this.onAnimationPause,

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
      constants.PIXEL_DELETE,               this.onPixelDelete,

      constants.BOX_FOLD,                   this.onBoxFold,
      constants.WINDOW_RESIZE,              this.onWindowResize,

      constants.BOX_PREVIEW_TOGGLE,         this.onBoxPreviewToggle,
      constants.ONION_TOGGLE,               this.onOnionToggle,
      constants.ONION_MODE,                 this.onOnionMode,
      constants.ONION_FRAME,                this.onOnionFrame,

      constants.SCOPE_SET,                  this.onScopeSet
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
        playing: false,
      },
      brightnessTool: {
        mode: 'lighten',
        intensity: 10,
      },
      color: {
        brush: new Color('#FFFFFF'),
        layer: new Color('#FFFFFF'),
        frame: new Color('#FFFFFF'),
      },
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
      menu: {
        visible: false,
      },
      offset: {
        top: 40,
        right: 228,
        bottom: 47, // + 20 for scrollbar
        left: 45,
      },
      onion: {
        active: false,
        frame: {
          fixed: 1,
          relative: 1,
        },
        mode: 'fixed', // 'fixed' or 'relative'
      },
      palettes: {
        selected: 0,
        available: [{'id': 'sprite', 'title': 'Sprite colours', 'short': 'Sprite', 'colors': []}],
      },
      scope: {
        center: new Point(0,0),
      },
      selection: {
        start: null,
        end: null,
        cursor: null,
        distance: null,
      },
      settings: {
        grid: true,
        animatedPaintPreview: false,
      },
      tab: 'start',
      tool: 'BrushTool',
      zoom: {
        min: 1,
        max: 50,
        selected: 10,
      },
      fold: {
        preview: false,
        frames: false,
        layers: false,
      },
      size: {
        animationPreview: 100,
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

      this.data.palettes.available[0].colors = _.uniq(palette);

      if(platformUtils.device == 'desktop') {
        enableMenus(true);
      }

      this.emit('change');
    });
  },

  onFileSize: function() {
    this.waitFor(['FileStore'], function(FileStore) {

      this.data.frames.total = FileStore.getData('frames').x * FileStore.getData('frames').y;

      // build sprite palette
      var palette = [],
          pixels  = FileStore.getData('pixels');

      pixels.forEach(function(px) { palette.push(px.toHex()); });

      this.data.palettes.available[0].colors = _.uniq(palette);
      this.emit('change');
    });
  },

  onTabSelect: function(tab) {
    hotkeys.unbind(this.data.tab);
    this.data.tab = tab;
    hotkeys.bind(tab);
    this.emit('change');
  },

  onToolSelect: function(tool) {
    this.data.tool = tool;
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

  onMenuShow: function() {
    this.data.menu.visible = true;
    this.emit('change');
  },

  onMenuHide: function() {
    this.data.menu.visible = false;
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

  onColorBrush: function(hexcode) {
    this.data.color.brush = new Color(hexcode);
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
    this.data.palettes.selected = parseInt(palette);
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
      this.data.layers.frame = _.filter(FileStore.getData().layers, {frame: this.data.frames.selected});
      this.emit('change');
    });
  },

  onLayerDelete: function(id) {
    this.waitFor(['FileStore'], function(FileStore) {
      this.data.layers.frame = _.filter(FileStore.getData().layers, {frame: this.data.frames.selected});
      this.emit('change');
    });
  },

  onLayerDrop: function(id) {
    this.waitFor(['FileStore'], function(FileStore) {
      this.data.layers.frame = _.filter(FileStore.getData().layers, {frame: this.data.frames.selected});
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

  onAnimationPlay: function() {
    this.data.animations.playing = true;
    this.emit('change');
  },

  onAnimationPause: function() {
    this.data.animations.playing = false;
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
    if(this.data.selection.start.x > this.data.selection.end.x ||
       this.data.selection.start.y > this.data.selection.end.y) {
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
    this.data.palettes.available[0].colors = _.uniq(this.data.palettes.available[0].colors);
    this.emit('change');
  },

  onPixelDelete: function(payload) {
    this.waitFor(['PixelStore'], function(PixelStore) {
      var palette = [],
          pixels  = PixelStore.getData(),
          pushToPalette = function(px) { palette.push(px.toHex()); };

      for(var x in pixels) {
        var pixelArr = pixels[x];
        try {
          pixelArr.forEach(pushToPalette);
        } catch(e) {}
      }

      this.data.palettes.available[0].colors = _.uniq(palette);
      this.emit('change');
    });
  },

  onBoxFold: function(box) {
    this.data.fold[box] = !this.data.fold[box];
    this.emit('change');
  },

  onWindowResize: function() {
    // scale animation preview
    var rect = document.getElementById('AnimationPreviewWrapper').getBoundingClientRect(),
        max = rect.width > rect.height ? rect.height : rect.width;

    this.data.size.animationPreview = Math.floor(max);
    this.emit('change');
  },

  onBoxPreviewToggle: function(isAnimated) {
    this.data.settings.animatedPaintPreview = isAnimated;
    this.emit('change');
  },

  onOnionToggle: function() {
    this.data.onion.active = !this.data.onion.active;
    this.emit('change');
  },

  onOnionMode: function(mode) {
    this.data.onion.mode = mode;
    this.emit('change');
  },

  onOnionFrame: function(payload) {
    this.data.onion.frame[payload.mode] = payload.value;
    this.emit('change');
  },

  onScopeSet: function(payload) {
    // set scope center
    var center;

    if(payload.type == 'layer') { // layer scope
      var s = flux.stores.FileStore.getData().size;
      center = new Point(
        (s.width+1)/2,
        (s.height+1)/2
      );
    }
    else if(payload.type == 'selection') { // selection scope
      center = new Point(
        (payload.data.start.x+payload.data.end.x+1)/2,
        (payload.data.start.y+payload.data.end.y+1)/2
      );
    }

    this.data.scope.center = center;
    this.emit('change');
  },
});

// module.exports = new UiStore();
