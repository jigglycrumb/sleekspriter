class Pixel {
  /**
   * Creates a new Pixel
   * @constructor
   * @param {Number} frame - frame ID
   * @param {Number} layer - layer ID
   * @param {Number} x - pixel x coordinate
   * @param {Number} y - pixel y coordinate
   * @param {Number} r - pixel red value (0-255)
   * @param {Number} g - pixel green value (0-255)
   * @param {Number} b - pixel blue value (0-255)
   * @param {Number} a - pixel alpha value (0-1)
   */
  constructor(frame, layer, x, y, r, g, b, a) {
    this.frame = frame;
    this.layer = layer;
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}

export default Pixel;
