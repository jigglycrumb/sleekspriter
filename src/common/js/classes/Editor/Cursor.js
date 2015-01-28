Editor.prototype.cursor = {};
Editor.prototype.cursor.position = new Point(1,1);

Editor.prototype.cursor.init = function() {
  var self = this;

  channel.gui.subscribe('cursor.set', function(data, envelope) {
    self.position = data.position;
  });
};