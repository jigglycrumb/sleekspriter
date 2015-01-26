Editor.prototype.clipboard = {};
Editor.prototype.clipboard.pixels = [];

Editor.prototype.clipboard.init = function() {
  var self = this;

  channel.subscribe('scope.copy', function(data, envelope) {
    console.log('should copy scope pixels now');
  });
};