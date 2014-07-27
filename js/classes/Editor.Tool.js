Editor.prototype.tool = {};
Editor.prototype.tool.selected = 'BrushTool';

Editor.prototype.tool.init = function() {
  var self = this;

  channel.subscribe('app.tool.select', function(data, envelope) {
    self.selected = data.tool;
  });
};