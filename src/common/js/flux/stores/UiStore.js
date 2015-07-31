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
      constants.LAYER_SELECT,               this.onLayerSelect
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
    };

    if(key && data[key]) this.data[key] = data[key];
    else this.data = data;
  },

  onFileLoad: function(payload) {
    this.waitFor(['FileStore'], function(FileStore) {
      this.data.frames.selected = 1;
      this.data.frames.total = FileStore.getData('frames').x * FileStore.getData('frames').y;

      this.data.layers.frame = this._updateFrameLayers(FileStore, 1); // get layers for frame 1

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
    this.data.frames.selected = parseInt(frame);
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


  _buildSpritePalette: function(FileStore) {
      var palette = [],
          pixels  = FileStore.getData('pixels');

      pixels.forEach(function(px) {
        palette.push(px.toHex());
      });

      this.data.palettes.available[0].colors = _.unique(palette, false);
  },

  _updateFrameLayers: function(FileStore, frame) {
    return _.where(FileStore.getData('layers'), {frame: frame});
  }
});