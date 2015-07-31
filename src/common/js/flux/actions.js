var actions = {
  fileCreate: function(framesX, framesY, pixelsX, pixelsY) {
    this.dispatch(constants.FILE_CREATE, {framesX: framesX, framesY: framesY, pixelsX: pixelsX, pixelsY: pixelsY});
  },
  fileLoad: function(data) {
    this.dispatch(constants.FILE_LOAD, data);
  },
  fileSave: function() {
    this.dispatch(constants.FILE_SAVE, {});
  },
  tabSelect: function(tab) {
    this.dispatch(constants.TAB_SELECT, {tab: tab});
  },
  toolSelect: function(tool) {
    this.dispatch(constants.TOOL_SELECT, {tool: tool});
  },
  settingsPaint: function(visible) {
    this.dispatch(constants.SETTINGS_PAINT, {visible: visible});
  },
  settingsGrid: function(visible) {
    this.dispatch(constants.SETTINGS_GRID, {visible: visible});
  },
  zoomSelect: function(zoom) {
    this.dispatch(constants.ZOOM_SELECT, {zoom: zoom});
  },
  backgroundSelect: function(type, value) {
    this.dispatch(constants.BACKGROUND_SELECT, {type: type, value: value});
  },
  frameSelect: function(frame) {
    this.dispatch(constants.FRAME_SELECT, {frame: frame});
  },
  modalShow: function(component, data) {
    data = data || {};
    this.dispatch(constants.MODAL_SHOW, {component: component, data: data, visible: true});
  },
  modalHide: function() {
    this.dispatch(constants.MODAL_HIDE);
  },
  brightnessToolMode: function(mode) {
    this.dispatch(constants.BRIGHTNESSTOOL_MODE, {mode: mode});
  },
  brightnessToolIntensity: function(intensity) {
    this.dispatch(constants.BRIGHTNESSTOOL_INTENSITY, {intensity: intensity});
  },
  cursorSet: function(position) {
    this.dispatch(constants.CURSOR_SET, {position: position});
  },
  colorBrush: function(hexcode) {
    this.dispatch(constants.COLOR_BRUSH, {hexcode: hexcode});
  },
  colorLayer: function(hexcode) {
    this.dispatch(constants.COLOR_LAYER, {hexcode: hexcode});
  },
  colorFrame: function(hexcode) {
    this.dispatch(constants.COLOR_FRAME, {hexcode: hexcode});
  },
  paletteLoad: function(json) {
    this.dispatch(constants.PALETTE_LOAD, {json: json});
  },
  paletteSelect: function(palette) {
    this.dispatch(constants.PALETTE_SELECT, palette);
  },
};