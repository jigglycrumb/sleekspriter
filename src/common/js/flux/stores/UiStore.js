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
      constants.COLOR_BRUSH,                this.onColorBrush
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
    };

    if(key && data[key]) this.data[key] = data[key];
    else this.data = data;
  },

  onFileLoad: function(payload) {
    this.waitFor(['FileStore'], function(FileStore) {
      this.data.frames.selected = 1;
      this.data.frames.total = FileStore.getData('frames').x * FileStore.getData('frames').y;
      this.emit('change');
    });
  },

  onTabSelect: function(payload) {
    this.data.tab = payload.tab;
    this.emit('change');
  },

  onToolSelect: function(payload) {
    this.data.tool = payload.tool;
    this.emit('change');
  },

  onSettingsPaint: function(payload) {
    this.data.settings.paint = payload.visible;
    this.emit('change');
  },

  onSettingsGrid: function(payload) {
    this.data.settings.grid = payload.visible;
    this.emit('change');
  },

  onZoomSelect: function(payload) {
    var z = parseInt(payload.zoom);
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

  onFrameSelect: function(payload) {
    this.data.frames.selected = parseInt(payload.frame);
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

  onBrightnessToolMode: function(payload) {
    this.data.brightnessTool.mode = payload.mode;
    this.emit('change');
  },

  onBrightnessToolIntensity: function(payload) {
    this.data.brightnessTool.intensity = parseInt(payload.intensity);
    this.emit('change');
  },

  onCursorSet: function(payload) {
    this.data.cursor = payload.position;
    this.emit('change');
  },

  onColorBrush: function(payload) {
    this.data.color.brush = new Color(payload.hexcode);
    this.emit('change');
  },
});