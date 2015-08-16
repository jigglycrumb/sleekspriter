Editor.prototype.layers = {};
Editor.prototype.layers.selected = null;
Editor.prototype.layers.frame = [];

/**
 * Initialize layers, setup message subscriptions
 */
Editor.prototype.layers.init = function() {
  // var self = this;

  // function updateFrameLayers(data) {
  //   self.frame = _.where(file.layers, {frame: data.frame});
  // }

  // channel.gui.subscribe('frame.select', function(data, envelope) {
  //   self.frame = _.where(file.layers, {frame: data.frame});
  //   setTimeout(self.selectTop.bind(self), 0); // select top layer
  // });

  // channel.gui.subscribe('layer.select', function(data, envelope) {
  //   // save old scope layer
  //   var oldScope = self.selected;

  //   // set new layer selected
  //   self.selected = data.layer;

  //   // restrict scope to layer
  //   var scopeData = {
  //     old: oldScope,
  //     scope: 'layer',
  //     data: self.selected,
  //   };

  //   // set new scope
  //   channel.gui.publish('scope.set', scopeData);
  // });

  // channel.gui.subscribe('layer.add', updateFrameLayers);
  // channel.gui.subscribe('layer.delete', updateFrameLayers);
  // channel.gui.subscribe('size.set', updateFrameLayers);

  // channel.gui.subscribe('layer.drop', updateFrameLayers);
};

/**
 * Get IDs of all frame layers in a flat array
 * @returns {Array} layer IDs
 */
// Editor.prototype.layers.getIds = function() {
//   return _.pluck(this.frame, 'id');
// };

/**
 * Select the top layer of the current frame and emit "layer.select"
 */
// Editor.prototype.layers.selectTop = function() {
//   var topLayer = _.max(this.frame, function(layer) { return layer.z; });
//   channel.gui.publish('layer.select', {layer: topLayer.id});
// };

/**
 * Get layer by ID
 * @returns {Object} layer
 */
// Editor.prototype.layers.getById = function(id) {
//   return _.findWhere(this.frame, {id: id});
// };

/**
 * Get selected layer
 * @returns {Object} layer
 */
// Editor.prototype.layers.getSelected = function() {
//   return this.getById(this.selected);
// };

/**
 * Get layer above selected layer
 * @returns {Object} layer
 */
// Editor.prototype.layers.getAboveSelected = function() {
//   var z = this.getSelected().z,
//       above = _.filter(this.frame, function(layer) { return layer.z > z });
//   return above.length === 0 ? false : _.min(above, 'z');
// };

/**
 * Get layer below selected layer
 * @returns {Object} layer
 */
// Editor.prototype.layers.getBelowSelected = function() {
//   var z = this.getSelected().z,
//       below = _.filter(this.frame, function(layer) { return layer.z < z });
//   return below.length === 0 ? false : _.max(below, 'z');
// };