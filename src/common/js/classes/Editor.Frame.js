Editor.prototype.frame = {};
Editor.prototype.frame.selected = 1;

Editor.prototype.frame.init = function() {
  var self = this;

  channel.subscribe('frame.select', function(data, envelope) {
    self.selected = parseInt(data.frame);
  });
};