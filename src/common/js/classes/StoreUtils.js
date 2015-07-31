var StoreUtils = function() {
  console.log('Constructing StoreUtils');
};

StoreUtils.prototype = {};
StoreUtils.prototype.constructor = StoreUtils;
StoreUtils.prototype.layers = {};

/**
 * Get IDs of all frame layers in a flat array
 * @returns {Array} layer IDs
 */
StoreUtils.prototype.layers.getIds = function() {
  return _.pluck(flux.stores.UiStore.getData('layers').frame, 'id');
};