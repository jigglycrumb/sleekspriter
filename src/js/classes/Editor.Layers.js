Editor.prototype.layers = {};
Editor.prototype.layers.selected = null;
Editor.prototype.layers.frame = [];

/**
 * Initialize layers, setup message subscriptions
 */
Editor.prototype.layers.init = function() {
  var self = this;

  channel.subscribe('frame.select', function(data, envelope) {
    self.frame = _.where(file.layers, {frame: data.frame});
    setTimeout(self.selectTop.bind(self), 0); // select top layer
  });

  channel.subscribe('layer.select', function(data, envelope) {
    // save old scope layer
    var oldScope = self.selected;

    // set new layer selected
    self.selected = data.layer;

    // restrict scope to layer
    var scopeData = {
      old: oldScope,
      scope: 'layer',
      data: self.selected,
    };

    // set new scope
    channel.publish('scope.set', scopeData);
  });

  channel.subscribe('app.layer.add', function(data, envelope) {
    self.frame = _.where(file.layers, {frame: data.frame});
  });

  channel.subscribe('app.layer.delete', function(data, envelope) {
    self.frame = _.where(file.layers, {frame: data.frame});
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
 * Select the top layer of the current frame and emit "layer.select"
 */
Editor.prototype.layers.selectTop = function() {
  var topLayer = _.max(this.frame, function(layer) { return layer.z; });
  channel.publish('layer.select', {layer: topLayer.id});
};