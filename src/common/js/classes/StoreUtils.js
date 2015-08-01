// A collection of various helper functions to access flux store data
var StoreUtils = function() {};

StoreUtils.prototype = {};
StoreUtils.prototype.constructor = StoreUtils;

// Layer-related helpers
StoreUtils.prototype.layers = {};

/**
 * Get IDs of all frame layers in a flat array
 * @returns {Array} layer IDs
 */
StoreUtils.prototype.layers.getIds = function() {
  return _.pluck(flux.stores.UiStore.getData('layers').frame, 'id');
};

/**
 * Get layer by ID
 * @returns {Object} layer
 */
StoreUtils.prototype.layers.getById = function(id) {
  return _.findWhere(flux.stores.UiStore.getData('layers').frame, {id: id});
};

/**
 * Get all layers of a given frame
 * @returns {Array} layer Objects
 */
StoreUtils.prototype.layers.getByFrame = function(frame) {
  return _.where(flux.stores.FileStore.getData('layers'), {frame: frame});
};


/**
 * Get selected layer
 * @returns {Object} layer
 */
StoreUtils.prototype.layers.getSelected = function() {
  return this.getById(flux.stores.UiStore.getData('layers').selected);
};

/**
 * Get layer above selected layer
 * @returns {Object} layer
 */
StoreUtils.prototype.layers.getAboveSelected = function() {
  var z = this.getSelected(),
      above = _.filter(flux.stores.UiStore.getData('layers').frame, function(layer) { return layer.z > z });
  return above.length === 0 ? false : _.min(above, 'z');
};

/**
 * Get layer below selected layer
 * @returns {Object} layer
 */
StoreUtils.prototype.layers.getBelowSelected = function() {
  var z = this.getSelected().z,
      below = _.filter(flux.stores.UiStore.getData('layers').frame, function(layer) { return layer.z < z });
  return below.length === 0 ? false : _.max(below, 'z');
};

/**
 * Get top layer
 * @returns {Object} layer
 */
StoreUtils.prototype.layers.getTop = function() {
  return _.max(flux.stores.UiStore.getData('layers').frame, function(layer) { return layer.z; });
};


// Animation-related helpers
StoreUtils.prototype.animations = {};

StoreUtils.prototype.animations.getByName = function(name) {
  return _.find(flux.stores.FileStore.getData('animations'), {name: name});
};

StoreUtils.prototype.animations.getSelected = function() {
  return this.getByName(flux.stores.UiStore.getData('animations').selected);
};