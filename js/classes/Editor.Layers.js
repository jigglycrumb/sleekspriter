Editor.prototype.layers = {};
Editor.prototype.layers.selected = null;
Editor.prototype.layers.frame = [];

Editor.prototype.layers.init = function() {
  var self = this;

  channel.subscribe('app.frame.select', function(data, envelope) {
    self.frame = _.where(file.layers, {frame: data.frame});
  });

  channel.subscribe('app.layer.select', function(data, envelope) {
    self.selected = data.layer;
  });
};

Editor.prototype.layers.getIds = function() {
  return _.pluck(this.frame, 'id');
};

Editor.prototype.layers.selectTop = function() {
  var topLayer = _.max(this.frame, function(layer) { return layer.z; });
  channel.publish('app.layer.select', {layer: topLayer.id});
};