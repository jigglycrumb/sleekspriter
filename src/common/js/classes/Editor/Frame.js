Editor.prototype.frames = {};
Editor.prototype.frames.selected = 1;
Editor.prototype.frames.x = 1;
Editor.prototype.frames.y = 1;

Editor.prototype.frames.init = function() {
  var self = this;

  channel.file.subscribe('file.load', function(data, envelope) {
    self.x = data.frames.x;
    self.y = data.frames.y;
  });

  channel.gui.subscribe('frame.select', function(data, envelope) {
    self.selected = parseInt(data.frame);
  });
};

Object.defineProperty(Editor.prototype.frames, 'total', {
  set: function() {
    throw("You can't set that.");
  },
  get: function() {
    return this.x * this.y;
  }
});