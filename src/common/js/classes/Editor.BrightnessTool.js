Editor.prototype.brightnessTool = {};

Editor.prototype.brightnessTool.mode = 'lighten';
Editor.prototype.brightnessTool.intensity = 10;

Editor.prototype.brightnessTool.init = function() {
  var self = this;

  channel.subscribe('brightnesstool.mode.select', function(data, envelope) {
    self.mode = data.mode;
  });

  channel.subscribe('brightnesstool.intensity.select', function(data, envelope) {
    self.intensity = data.intensity;
  });
};