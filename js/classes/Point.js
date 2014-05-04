var Point = function(x, y) {
  this.x = x;
  this.y = y;
};

Point.prototype = Object.create(null);
Point.prototype.constructor = Point;

Point.prototype.translate = function(distance) {
  this.x += distance.x;
  this.y += distance.y;
  return this;
}