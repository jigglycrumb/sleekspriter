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

  channel.subscribe('animation.fps', function(data, envelope) {
    self.list.some(function(animation) {
      if(animation.name === data.name) animation.fps = +data.fps;
      return animation.name === data.name;
    });
  });
};

Editor.prototype.animations.getByName = function(name) {
  return _.find(this.list, {name: name});
};

Editor.prototype.animations.getSelected = function() {
  return this.getByName(this.selected);
}