Editor.prototype.animations = {};
Editor.prototype.animations.list = [];

Editor.prototype.animations.init = function() {
  var self = this;

  channel.subscribe('file.load', function() {
    self.list = file.animations;
  });
};