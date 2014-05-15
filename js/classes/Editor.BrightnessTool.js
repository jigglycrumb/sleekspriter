Editor.prototype.brightnessTool = {};

Editor.prototype.brightnessTool.mode = 'lighten';
Editor.prototype.brightnessTool.intensity = 10;

Editor.prototype.brightnessTool.init = function() {
  var self = this;

  signal.brightnessToolIntensityChanged.add(function(intensity) {
    self.intensity = intensity;
  });

  signal.brightnessToolModeChanged.add(function(mode) {
    self.mode = mode;
  });
};