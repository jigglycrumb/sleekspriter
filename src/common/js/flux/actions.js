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
    this.dispatch(constants.TAB_SELECT, tab);
  },
  toolSelect: function(tool) {
    this.dispatch(constants.TOOL_SELECT, tool);
  },
  settingsPaint: function(visible) {
    this.dispatch(constants.SETTINGS_PAINT, visible);
  },
  settingsGrid: function(visible) {
    this.dispatch(constants.SETTINGS_GRID, visible);
  },
  zoomSelect: function(zoom) {
    this.dispatch(constants.ZOOM_SELECT, zoom);
  },
  backgroundSelect: function(type, value) {
    this.dispatch(constants.BACKGROUND_SELECT, {type: type, value: value});
  },
  frameSelect: function(frame) {
    this.dispatch(constants.FRAME_SELECT, frame);
  },
  modalShow: function(component, data) {
    data = data || {};
    this.dispatch(constants.MODAL_SHOW, {component: component, data: data, visible: true});
  },
  modalHide: function() {
    this.dispatch(constants.MODAL_HIDE);
  },
  brightnessToolMode: function(mode) {
    this.dispatch(constants.BRIGHTNESSTOOL_MODE, mode);
  },
  brightnessToolIntensity: function(intensity) {
    this.dispatch(constants.BRIGHTNESSTOOL_INTENSITY, intensity);
  },
  cursorSet: function(position) {
    this.dispatch(constants.CURSOR_SET, position);
  },
  colorBrush: function(hexcode) {
    this.dispatch(constants.COLOR_BRUSH, hexcode);
  },
  colorLayer: function(hexcode) {
    this.dispatch(constants.COLOR_LAYER, hexcode);
  },
  colorFrame: function(hexcode) {
    this.dispatch(constants.COLOR_FRAME, hexcode);
  },
  paletteLoad: function(json) {
    this.dispatch(constants.PALETTE_LOAD, json);
  },
  paletteSelect: function(palette) {
    this.dispatch(constants.PALETTE_SELECT, palette);
  },
  layerSelect: function(layer) {
    this.dispatch(constants.LAYER_SELECT, layer);
  },
  layerVisibility: function(layer, visible) {
    this.dispatch(constants.LAYER_VISIBILITY, {layer: layer, visible: visible});
  },
  layerOpacity: function(layer, opacity) {
    this.dispatch(constants.LAYER_OPACITY, {layer: layer, opacity: opacity});
  },
  layerName: function(layer, name) {
    this.dispatch(constants.LAYER_NAME, {layer: layer, name: name});
  },
  layerTopSelect: function() {
    this.dispatch(constants.LAYER_TOP_SELECT);
  },
  animationSelect: function(name) {
    this.dispatch(constants.ANIMATION_SELECT, name);
  },
  animationName: function(animation, name) {
    this.dispatch(constants.ANIMATION_NAME, {animation: animation, name: name});
  },
  animationFps: function(animation, fps) {
    this.dispatch(constants.ANIMATION_FPS, {animation: animation, fps: fps});
  },
  animationAdd: function() {
    this.dispatch(constants.ANIMATION_ADD);
  },
  animationDelete: function(animation) {
    this.dispatch(constants.ANIMATION_DELETE, animation);
  },
  animationFrameAdd: function(animation, position, frame) {
    this.dispatch(constants.ANIMATION_FRAME_ADD, {animation: animation, position: position, frame: frame});
  },
  animationFrameEmpty: function(animation) {
    this.dispatch(constants.ANIMATION_FRAME_EMPTY, animation);
  },
  animationFrameDelete: function(animation, position, frame) {
    this.dispatch(constants.ANIMATION_FRAME_DELETE, {animation: animation, position: position, frame: frame});
  },
  animationFrameSelect: function(position) {
    this.dispatch(constants.ANIMATION_FRAME_SELECT, position);
  },
  exportPart: function(part) {
    this.dispatch(constants.EXPORT_PART, part);
  },
  exportFrame: function(frame) {
    this.dispatch(constants.EXPORT_FRAME, frame);
  },
  exportAnimation: function(animation) {
    this.dispatch(constants.EXPORT_ANIMATION, animation);
  },
  exportZoom: function(zoom) {
    this.dispatch(constants.EXPORT_ZOOM, zoom);
  },
  exportFormat: function(format) {
    this.dispatch(constants.EXPORT_FORMAT, format);
  },
  exportStatus: function(text) {
    this.dispatch(constants.EXPORT_STATUS, text);
  },
};