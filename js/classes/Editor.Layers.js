Editor.prototype.layers = {};
Editor.prototype.layers.selected = null;
Editor.prototype.layers.frame = [];

/**
 * Initialize layers, setup message subscriptions
 */
Editor.prototype.layers.init = function() {
  var self = this;

  channel.subscribe('app.frame.select', function(data, envelope) {
    self.frame = _.where(file.layers, {frame: data.frame});
    setTimeout(self.selectTop.bind(self), 0); // select top layer
  });

  channel.subscribe('app.layer.select', function(data, envelope) {
    self.selected = data.layer;
  });
};

/**
 * Get IDs of all frame layers in a flat array
 * @returns {Array} layer IDs
 */
Editor.prototype.layers.getIds = function() {
  return _.pluck(this.frame, 'id');
};

/**
 * Select the top layer of the current frame and emit "app.layer.select"
 */
Editor.prototype.layers.selectTop = function() {
  var topLayer = _.max(this.frame, function(layer) { return layer.z; });
  channel.publish('app.layer.select', {layer: topLayer.id});
};