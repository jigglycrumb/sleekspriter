Editor.prototype.selection = false; // false when no selection is active, array of two points (selection start, selection end) otherwise

Editor.prototype.selectionContains = function(point) {
  if(this.selection) {
    if(!_.isUndefined(this.selection.start)
    && !_.isUndefined(this.selection.end)) {
      // ok, selection is valid
      return point.x >= this.selection.start.x
      && point.x <= this.selection.end.x
      && point.y >= this.selection.start.y
      && point.y <= this.selection.end.y;
    }
  }
};

Editor.prototype.selectionActive = function() {
  return this.selection.start instanceof Point
      && this.selection.end instanceof Point;
};

Editor.prototype.selectionResizing = function() {
  return this.selection.start instanceof Point
      && this.selection.cursor instanceof Point;
};

Editor.prototype.selectionMoving = function() {
  return this.selection.start instanceof Point
      && this.selection.end instanceof Point
      && this.selection.distance instanceof Point;
};