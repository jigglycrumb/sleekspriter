Editor.prototype.pixels = {};
Editor.prototype.pixels.selected = null;
Editor.prototype.pixels.layer = [];
Editor.prototype.pixels.frame = [];
Editor.prototype.pixels.selection = [];

Editor.prototype.pixels.init = function() {
  var self = this;

  // merges selection to layer and clears selection
  function saveAndClearSelection() {
    self.selection.forEach(function(pixel) {
      self.layer.push(pixel);
    });

    self.layer = _.unique(self.layer, function(p) { return p.layer+','+p.x+','+p.y });
    self.selection = [];
  };

  function pixelHasBeenSelected(pixel) {
    return editor.selection.contains(pixel) && pixel.layer == editor.layers.selected;
  };

  channel.subscribe('app.frame.select', function(data, envelope) {
    self.frame = _.where(file.pixels, {frame: data.frame});
  });

  channel.subscribe('app.layer.select', function(data, envelope) {
    self.layer = _.where(self.frame, {layer: data.layer});
  });

  channel.subscribe('app.tool.select', function(data, envelope) {
    if(editor.selection.isActive) {
      switch(data.tool) {
        case 'RectangularSelectionTool':
          saveAndClearSelection();
          break;
        default:
          // move selected pixels from layer to selection
          self.selection = _.filter(self.layer, pixelHasBeenSelected);
          self.layer = _.reject(self.layer, pixelHasBeenSelected);
          break;
      }
    }
  });


  channel.subscribe('stage.selection.move.pixels', function(data, envelope) {
    self.selection.forEach(function(p) {
      p.x += data.distance.x;
      p.y += data.distance.y;
    });
  });

  channel.subscribe('stage.selection.clear', saveAndClearSelection);
};