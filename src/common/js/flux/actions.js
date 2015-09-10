var actions = {
  fileCreate: function(framesX, framesY, pixelsX, pixelsY) {
    this.dispatch(constants.FILE_CREATE, {frames: {x: framesX, y: framesY}, pixels: {x: pixelsX, y: pixelsY}});
  },
  fileLoad: function(data) {
    this.dispatch(constants.FILE_LOAD, data);
  },
  fileSave: function() {
    this.dispatch(constants.FILE_SAVE);
  },
  fileSaveAs: function(path) {
    this.dispatch(constants.FILE_SAVE_AS, path);
  },
  fileSize: function(framesX, framesY, pixelsX, pixelsY) {
    this.dispatch(constants.FILE_SIZE, {frames: {x: framesX, y: framesY}, pixels: {x: pixelsX, y: pixelsY}});
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
  frameFlipHorizontal: function() {
    this.dispatch(constants.FRAME_FLIP_HORIZONTAL);
  },
  frameFlipVertical: function() {
    this.dispatch(constants.FRAME_FLIP_VERTICAL);
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
  cursorSet: function(position, layerColor, frameColor) {
    this.dispatch(constants.CURSOR_SET, {position: position, color: {layer: layerColor, frame: frameColor}});
  },
  colorBrush: function(hexcode) {
    this.dispatch(constants.COLOR_BRUSH, hexcode);
  },
  // colorLayer: function(color) {
  //   this.dispatch(constants.COLOR_LAYER, color);
  // },
  // colorFrame: function(color) {
  //   this.dispatch(constants.COLOR_FRAME, color);
  // },
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
  layerAdd: function(selectedLayer) {
    this.dispatch(constants.LAYER_ADD, selectedLayer);
  },
  layerDelete: function(layer) {
    this.dispatch(constants.LAYER_DELETE, layer);
  },
  layerDrop: function(layer, position) {
    this.dispatch(constants.LAYER_DROP, {layer: layer, position: position});
  },
  layerMerge: function(top, bottom) {
    this.dispatch(constants.LAYER_MERGE, {top: top, bottom: bottom});
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
  scopeSet: function(oldScope, type, data) {
    this.dispatch(constants.SCOPE_SET, {oldScope: oldScope, type: type, data: data});
  },
  scopeCopy: function() {
    this.dispatch(constants.SCOPE_COPY);
  },
  scopeCut: function() {
    this.dispatch(constants.SCOPE_CUT);
  },
  scopeDelete: function() {
    this.dispatch(constants.SCOPE_DELETE);
  },
  scopePaste: function() {
    this.dispatch(constants.SCOPE_PASTE);
  },
  scopeFlipHorizontal: function() {
    this.dispatch(constants.SCOPE_FLIP_HORIZONTAL);
  },
  scopeFlipVertical: function() {
    this.dispatch(constants.SCOPE_FLIP_VERTICAL);
  },
  selectionStart: function(point) {
    this.dispatch(constants.SELECTION_START, point);
  },
  selectionResize: function(point) {
    this.dispatch(constants.SELECTION_RESIZE, point);
  },
  selectionPreview: function(point) {
    this.dispatch(constants.SELECTION_PREVIEW, point);
  },
  selectionEnd: function(point) {
    this.dispatch(constants.SELECTION_END, point);
  },
  selectionClear: function() {
    this.dispatch(constants.SELECTION_CLEAR);
  },
  selectionMove: function(distance) {
    this.dispatch(constants.SELECTION_MOVE, distance);
  },
  pixelAdd: function(frame, layer, x, y, z, color) {
    this.dispatch(constants.PIXEL_ADD, {frame: frame, layer: layer, x: x, y: y, z: z, color: color});
  },
  pixelDelete: function(layer, x, y) {
    this.dispatch(constants.PIXEL_DELETE, {layer: layer, x: x, y: y});
  },
  pixelsMove: function(distance) {
    this.dispatch(constants.PIXELS_MOVE, distance);
  },
  paintbucket: function(point) {
    this.dispatch(constants.PAINTBUCKET, point);
  },

};