Editor.prototype.palettes = {};
Editor.prototype.palettes.selected = 'sprite';
Editor.prototype.palettes.available = {};

Editor.prototype.palettes.init = function() {
  var self = this;

  channel.gui.subscribe('palette.select', function(data, envelope) {
    self.selected = data.palette;
  });

  channel.gui.subscribe('pixel.add', function(data, envelope) {
    self.available.sprite.colors.push(data.color);
    self.available.sprite.colors = _.unique(self.available.sprite.colors, false);
  });

  channel.gui.subscribe('pixel.delete', function(data, envelope) {
    self.buildAuto();
  });

  channel.file.subscribe('file.load', function(data, envelope) {
    self.buildAuto();
  });
};

Editor.prototype.palettes.buildAuto = function() {
  var palette = [];
  editor.pixels.file.forEach(function(px) {
    palette.push(px.toHex());
  });
  this.available.sprite.colors = _.unique(palette, false);
};

Editor.prototype.palettes.getSelected = function() {
  return this.available[this.selected];
}