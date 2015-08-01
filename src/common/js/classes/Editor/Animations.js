Editor.prototype.animations = {};
Editor.prototype.animations.list = [];
Editor.prototype.animations.selected = null;

Editor.prototype.animations.init = function() {
  var self = this;

  // channel.file.subscribe('file.load', function() {
  //   self.list = file.animations;
  // });

  channel.file.subscribe('animation.rename', function(data, envelope) {
    if(self.selected === data.oldName) self.selected = data.newName;
  });

  channel.gui.subscribe('animation.delete', function() {
    self.list = file.animations;
    self.selected = null;
  });

  channel.gui.subscribe('animation.select', function(data, envelope) {
    self.selected = data.name;
  });
};

/*
Editor.prototype.animations.getByName = function(name) {
  return _.find(this.list, {name: name});
};

Editor.prototype.animations.getSelected = function() {
  return this.getByName(this.selected);
}
*/