Editor.prototype.pixels = {};
Editor.prototype.pixels.selected = null;
Editor.prototype.pixels.layer = [];
Editor.prototype.pixels.frame = [];

Editor.prototype.pixels.init = function() {
  var self = this;

  channel.subscribe('app.frame.select', function(data, envelope) {
    self.frame = _.where(file.pixels, {frame: data.frame});
  });

  channel.subscribe('app.layer.select', function(data, envelope) {
    self.layer = _.where(self.frame, {layer: data.layer});
  });
};