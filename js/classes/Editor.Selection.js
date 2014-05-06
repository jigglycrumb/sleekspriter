Editor.prototype.selection = {};

Editor.prototype.selection.init = function(signal) {

  var self = this;

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

};

Editor.prototype.selection.bounds = false;

Editor.prototype.selection.pixels = [];

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