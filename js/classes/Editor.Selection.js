Editor.prototype.selection = {};
Editor.prototype.selection.bounds = false;
Editor.prototype.selection.init = function(editor) {

  var self = this;

  channel.subscribe('selection.clear', function(data, envelope) {
    self.bounds = false;
  });

  channel.subscribe('selection.start', function(data, envelope) {
    self.bounds = {
      start: data.point
    };
  });

  channel.subscribe('selection.end', function(data, envelope) {
    self.bounds = { // reset self selection to remove cursor property as it's no longer needed
      start: self.bounds.start,
      end: data.point
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

  channel.subscribe('selection.resize', function(data, envelope) {
    self.bounds.cursor = data.point;
  });

  channel.subscribe('selection.preview', function(data, envelope) {
    self.bounds.distance = data.distance;
  });

  channel.subscribe('selection.move', function(data, envelope) {
    self.bounds = {
      start: new Point(
        self.bounds.start.x + data.distance.x,
        self.bounds.start.y + data.distance.y
      ),
      end: new Point(
        self.bounds.end.x + data.distance.x,
        self.bounds.end.y + data.distance.y
      )
    };
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