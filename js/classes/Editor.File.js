Editor.prototype.file = {};
Editor.prototype.file.name = false;
Editor.prototype.file.frames = {x: 0, y: 0};
Editor.prototype.file.size = {width: 0, height: 0};

Editor.prototype.file.init = function() {
  var self = this;

  channel.subscribe('file.load', function(data, envelope) {
    self.size = data.size;
    self.frames = data.frames;
  });
};