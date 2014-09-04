Editor.prototype.background = {};
Editor.prototype.background.type = 'pattern';
Editor.prototype.background.value = 'checkerboard';

Editor.prototype.background.init = function() {
  var self = this;

  channel.subscribe('app.background.select', function(data, envelope) {
    self.type = data.type;
    self.value = data.value;
  });

};