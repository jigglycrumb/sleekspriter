// A collection of various helper functions to access flux store data
var StoreUtils = function() {};

StoreUtils.prototype = {};
StoreUtils.prototype.constructor = StoreUtils;

//------------------------------------------------------------------------------
// Frame Helpers
//------------------------------------------------------------------------------

StoreUtils.prototype.frames = {};

/**
 * Get selected frame
 * @returns {Number} Frame number
 */
StoreUtils.prototype.frames.getSelected = function() {
  return flux.stores.UiStore.getData().frames.selected;
};

//------------------------------------------------------------------------------
// Layer Helpers
//------------------------------------------------------------------------------

StoreUtils.prototype.layers = {};

/**
 * Get IDs of all frame layers in a flat array
 * @returns {Array} layer IDs
 */
StoreUtils.prototype.layers.getIds = function() {
  return _.pluck(flux.stores.UiStore.getData().layers.frame, 'id');
};

/**
 * Get layer by ID
 * @returns {Object} layer
 */
StoreUtils.prototype.layers.getById = function(id) {
  return _.find(flux.stores.UiStore.getData().layers.frame, {id: id});
};

/**
 * Get all layers of a given frame
 * @returns {Array} layer Objects
 */
StoreUtils.prototype.layers.getByFrame = function(frame) {
  return _.filter(flux.stores.FileStore.getData().layers, {frame: frame});
};

/**
 * Get selected layer
 * @returns {Object} layer
 */
StoreUtils.prototype.layers.getSelected = function() {
  return this.getById(flux.stores.UiStore.getData().layers.selected);
};

/**
 * Get layer above selected layer
 * @returns {Object} layer
 */
StoreUtils.prototype.layers.getAboveSelected = function() {
  var z = this.getSelected(),
      above = _.filter(flux.stores.UiStore.getData().layers.frame, function(layer) { return layer.z > z; });
  return above.length === 0 ? false : _.min(above, 'z');
};

/**
 * Get layer below selected layer
 * @returns {Object} layer
 */
StoreUtils.prototype.layers.getBelowSelected = function() {
  var z = this.getSelected().z,
      below = _.filter(flux.stores.UiStore.getData().layers.frame, function(layer) { return layer.z < z; });
  return below.length === 0 ? false : _.max(below, 'z');
};

/**
 * Get top layer
 * @returns {Object} layer
 */
StoreUtils.prototype.layers.getTop = function() {
  return _.max(flux.stores.UiStore.getData().layers.frame, function(layer) { return layer.z; });
};


Object.defineProperty(StoreUtils.prototype.layers, 'isVisible', {
  enumerable: true,
  configurable: false,
  get: function() {
    var layer = this.getSelected();
    return layer.visible && layer.opacity > 0;
  }
});

//------------------------------------------------------------------------------
// Animation Helpers
//------------------------------------------------------------------------------

StoreUtils.prototype.animations = {};

/**
 * Get animation by ID
 * @returns {Object} animation
 */
StoreUtils.prototype.animations.getById = function(id) {
  return _.find(flux.stores.FileStore.getData().animations, {id: id});
};

/**
 * Get selected animation
 * @returns {Object} animation
 */
StoreUtils.prototype.animations.getSelected = function() {
  return this.getById(flux.stores.UiStore.getData().animations.selected);
};

//------------------------------------------------------------------------------
// Selection Helpers
//------------------------------------------------------------------------------

StoreUtils.prototype.selection = {};

StoreUtils.prototype.selection.contains = function(point) {
  if(this.isActive) {
    var s = flux.stores.UiStore.getData().selection;
    return point.x >= s.start.x &&
           point.x <= s.end.x &&
           point.y >= s.start.y &&
           point.y <= s.end.y;
  }
  else return false;
};

Object.defineProperty(StoreUtils.prototype.selection, 'isActive', {
  enumerable: true,
  configurable: false,
  get: function() {
    var s = flux.stores.UiStore.getData().selection;
    return s.start instanceof Point &&
           s.end instanceof Point;
  }
});

Object.defineProperty(StoreUtils.prototype.selection, 'isResizing', {
  enumerable: true,
  configurable: false,
  get: function() {
    var s = flux.stores.UiStore.getData().selection;
    return s.start instanceof Point &&
           s.cursor instanceof Point;
  }
});

Object.defineProperty(StoreUtils.prototype.selection, 'isMoving', {
  enumerable: true,
  configurable: false,
  get: function() {
    var s = flux.stores.UiStore.getData().selection;
    return s.start instanceof Point &&
           s.end instanceof Point &&
           s.distance instanceof Point;
  }
});

//------------------------------------------------------------------------------
// Onion Helpers
//------------------------------------------------------------------------------

StoreUtils.prototype.onion = {};

StoreUtils.prototype.onion.getActualFrame = function() {
  var ui = flux.stores.UiStore.getData();
  var onionFrame = ui.onion.frame[ui.onion.mode];

  if(ui.onion.mode == 'relative') onionFrame = onionFrame + ui.frames.selected;
  if(onionFrame > ui.frames.total) onionFrame = onionFrame - ui.frames.total;
  if(onionFrame < 1) onionFrame = onionFrame + ui.frames.total;

  return onionFrame;
};

//------------------------------------------------------------------------------
// Pixel Helpers
//------------------------------------------------------------------------------

StoreUtils.prototype.pixels = {};

StoreUtils.prototype.pixels.manipulate = function(frame, layer, x, y, callback) {

};

module.exports = new StoreUtils();
