Editor.prototype.brightnessTool = {};

Editor.prototype.brightnessTool.mode = 'lighten';
Editor.prototype.brightnessTool.intensity = 10;

Editor.prototype.brightnessTool.init = function() {
  var self = this;

  channel.gui.subscribe('brightnesstool.mode.select', function(data, envelope) {
    self.mode = data.mode;
  });

  channel.gui.subscribe('brightnesstool.intensity.select', function(data, envelope) {
    self.intensity = data.intensity;
  });
};