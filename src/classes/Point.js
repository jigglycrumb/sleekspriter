class Point {
  /**
   * Creates a new Point
   * @constructor
   * @param {Number} x - point x coordinate
   * @param {Number} y - point y coordinate
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Moves a point by a given distance
   * @param {Object} distance - Point with distance coordinates
   * @param {Bool} dryRun - Do not modify the original point, default: false
   * @return {Object} the updated Point
   */
  translate(distance, dryRun = false) {
    const
      targetX = this.x + distance.x,
      targetY = this.y + distance.y;

    if(dryRun === true) {
      return new Point(targetX, targetY);
    }

    this.x = targetX;
    this.y = targetY;
    return this;
  }
}

export default Point;

// needs store, should be un-coupled
/**
 * Moves a point by a given distance, wrapping around if the canvas end is reached
 * @param {Object} distance - Point with distance coordinates
 * @param {Bool} simulate - Do not modify the original point
 * @return {Object} the updated Point
 */
/*
Point.prototype.wrap = function(distance, simulate) {
  simulate = simulate || false;

  var targetX = this.x + distance.x,
      targetY = this.y + distance.y,
      size    = flux.stores.FileStore.getData().size;

  if(targetX > size.width) targetX -= size.width;
  else if(targetX < 1) targetX += size.width;
  if(targetY > size.height) targetY -= size.height;
  else if(targetY < 1) targetY += size.height;

  if(simulate === true) {
    return new Point(targetX, targetY);
  }

  this.x = targetX;
  this.y = targetY;
  return this;
};
*/
