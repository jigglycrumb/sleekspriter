class Point {
  /**
   * Creates a new Point
   * @constructor
   * @param {Number} x - point x coordinate
   * @param {Number} y - point y coordinate
   */
  constructor(x, y) {
    this.x = +x;
    this.y = +y;
  }

  /**
   * Moves the point by a given distance
   * @param {Object} distance - Point with distance coordinates
   * @param {Bool} dryRun - Do not modify the original point, default: false
   * @return {Object} the updated Point
   */
  translate(distance, dryRun = false) {
    const targetX = this.x + distance.x;
    const targetY = this.y + distance.y;

    if (dryRun === true) {
      return new Point(targetX, targetY);
    }

    this.x = targetX;
    this.y = targetY;
    return this;
  }

  /**
   * Rotates the point by an angle around another point
   * @param {Number} angle - rotation angle
   * @param {Object} pivot - pivot point
   * @return {Object} the updated Point
   */
  rotate(angle, pivot) {
    // sanitize & convert angle
    if (angle < 0) angle = 360 + angle;
    angle = angle * (Math.PI / 180); // Convert to radians

    const rotatedX = Math.round(
      Math.cos(angle) * (this.x - pivot.x) -
        Math.sin(angle) * (this.y - pivot.y) +
        pivot.x
    );
    const rotatedY = Math.round(
      Math.sin(angle) * (this.x - pivot.x) +
        Math.cos(angle) * (this.y - pivot.y) +
        pivot.y
    );

    this.x = rotatedX;
    this.y = rotatedY;
    return this;
  }

  /**
   * Flips the point vertically around another point
   * @param {Object} pivot - pivot point
   * @return {Object} the updated Point
   */
  flipVertical(pivot) {
    const targetY = pivot.y * 2 - this.y;
    this.y = targetY;
    return this;
  }

  /**
   * Flips the point horizontally around another point
   * @param {Object} pivot - pivot point
   * @return {Object} the updated Point
   */
  flipHorizontal(pivot) {
    const targetX = pivot.x * 2 - this.x;
    this.x = targetX;
    return this;
  }
}

export default Point;

// needs file size from store, should be un-coupled
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
