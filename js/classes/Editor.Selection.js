Editor.prototype.selection = {};

Editor.prototype.selection.bounds = false;

Editor.prototype.selection.pixels = [];



Editor.prototype.selection.init = function(editor, signal) {

  var self = this;

  function saveAndClearPixels() {
    // merge editor.selection.pixels back to editor.pixels
    self.pixels.forEach(function(pixel) {
      editor.pixels.push(pixel);
    });

    editor.pixels = _.unique(editor.pixels, function(p) { return p.layer+','+p.x+','+p.y });
    self.pixels = [];
  };

  signal.selectionStarted.add(function(point) {
    self.bounds = {
      start: point
    };
  });

  signal.selectionResized.add(function(point) {
    self.bounds.cursor = point;
  });

  signal.selectionUpdated.add(function(distance) {
    self.bounds.distance = distance;
  });

  signal.selectionEnded.add(function(point) {
    self.bounds = { // reset self selection to remove cursor property as it's no longer needed
      start: self.bounds.start,
      end: point
    };

    // switch start & end if start is more "lower right" than end
    // makes iterating over the selection easier later
    if(self.bounds.start.x > self.bounds.end.x
    || self.bounds.start.y > self.bounds.end.y) {
      var temp = self.bounds.start;
      self.bounds.start = self.bounds.end;
      self.bounds.end = temp;
    }
  });

  signal.selectionCleared.add(function(point) {
    self.bounds = false;
    saveAndClearPixels();
  });

  signal.selectionMoved.add(function(distance) {
    self.bounds = {
      start: new Point(
        self.bounds.start.x + distance.x,
        self.bounds.start.y + distance.y
      ),
      end: new Point(
        self.bounds.end.x + distance.x,
        self.bounds.end.y + distance.y
      )
    };
  });

  signal.selectionPixelsMoved.add(function(distance) {
    self.pixels.forEach(function(p) {
      p.x += distance.x;
      p.y += distance.y;
    });
  });


  channel.subscribe('app.tool.select', function(data, envelope) {
    if(editor.selection.isActive) {
      switch(data.tool) {
        case 'RectangularSelectionTool':
          saveAndClearPixels();
          break;
        default:
          // move selected pixels from editor.pixels to editor.selection.pixels
          self.pixels = _.filter(editor.pixels, function(pixel) {
              return self.contains(pixel);
          });

          editor.pixels = _.reject(editor.pixels, function(pixel) {
              return self.contains(pixel);
          });
          break;
      }
    }
  });

};

Editor.prototype.selection.contains = function(point) {
  if(this.isActive)
    return point.x >= this.bounds.start.x
        && point.x <= this.bounds.end.x
        && point.y >= this.bounds.start.y
        && point.y <= this.bounds.end.y;
};

Object.defineProperty(Editor.prototype.selection, 'isActive', {
  enumerable: true,
  configurable: false,
  get: function() {
    return this.bounds.start instanceof Point
        && this.bounds.end instanceof Point;
  }
});

Object.defineProperty(Editor.prototype.selection, 'isResizing', {
  enumerable: true,
  configurable: false,
  get: function() {
    return this.bounds.start instanceof Point
        && this.bounds.cursor instanceof Point;
  }
});

Object.defineProperty(Editor.prototype.selection, 'isMoving', {
  enumerable: true,
  configurable: false,
  get: function() {
    return this.bounds.start instanceof Point
        && this.bounds.end instanceof Point
        && this.bounds.distance instanceof Point;
  }
});