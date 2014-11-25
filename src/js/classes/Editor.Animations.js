Editor.prototype.animations = {};
Editor.prototype.animations.list = [];
Editor.prototype.animations.selected = null;

Editor.prototype.animations.init = function() {
  var self = this;

  channel.subscribe('file.load', function() {
    self.list = file.animations;
  });

  channel.subscribe('animation.delete', function() {
    self.list = file.animations;
  });

  channel.subscribe('animation.select', function(data, envelope) {
    self.selected = data.name;
  });
};

Editor.prototype.animations.getFrames = function(name) {
  return _.find(this.list, {name: name}).frames;
};