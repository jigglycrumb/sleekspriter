/**
 * Creates a new Point
 * @constructor
 * @param {Number} x - point x coordinate
 * @param {Number} y - point y coordinate
 */
var Point = function(x, y) {
  this.x = x;
  this.y = y;
};

Point.prototype = {};
Point.prototype.constructor = Point;

/**
 * Moves a point by a given distance
 * @constructor
 * @param {Object} distance - Point with distance coordinates
 * @return {Object} the updated Point
 */
Point.prototype.translate = function(distance) {
  this.x += distance.x;
  this.y += distance.y;
  return this;
}