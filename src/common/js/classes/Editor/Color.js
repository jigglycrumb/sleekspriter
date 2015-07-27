// obsolete, now in UiStore

Editor.prototype.color = {};
Editor.prototype.color.brush = new Color('#000000');
Editor.prototype.color.layer = new Color('#000000');
Editor.prototype.color.frame = new Color('#000000');

Editor.prototype.color.init = function() {
  var self = this;

  channel.gui.subscribe('color.select', function(data, envelope) {
    self.brush = new Color(data.color);
  });
};