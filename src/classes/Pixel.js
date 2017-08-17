import Point from "./Point";

class Pixel extends Point {
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

    super(x, y);

    this.frame = frame;
    this.layer = layer;
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

    return this;
  }

  /**
   * Creates a hex string from pixel color values
   * @return {String} The hex string
   */
  toHex() {
    const pad = (s) => {
      return (s.length === 1 ? `0${s}` : s).toUpperCase();
    };

    return `#${pad(this.r.toString(16))}${pad(this.g.toString(16))}${pad(this.b.toString(16))}`;
  }
}

export default Pixel;
