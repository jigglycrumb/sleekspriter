Editor.prototype.file = {};
Editor.prototype.file.name = false;
Editor.prototype.file.size = {width: 0, height: 0};

Editor.prototype.file.init = function() {
  var self = this,
      updateSize = function(data) {
        self.size = data.size;
      };

  channel.file.subscribe('file.load', updateSize);
  channel.gui.subscribe('size.set', updateSize);
};