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
 * @param {Number} z - pixel z value (== layer z, duplicated for faster sorts)
 */
var Pixel = function(frame, layer, x, y, r, g, b, a, z) {
  this.frame = frame;
  this.layer = layer;
  this.x = x;
  this.y = y;
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
  this.z = z;
};

Pixel.prototype = new Point();
Pixel.prototype.constructor = Pixel;

/**
 * Creates CSS rgba() string from pixel values
 * @return {String} The rgba string
 */
Pixel.prototype.toRgba = function() {
  return 'rgba('+this.r+','+this.g+','+this.b+','+this.a+')';
};

/**
 * Creates CSS rgb() string from pixel values
 * @return {String} The rgb string
 */
Pixel.prototype.toRgb = function() {
  return 'rgb('+this.r+','+this.g+','+this.b+')';
};

/**
 * Creates a new pixel from flat array
 * @param {Number[]} arr [frame, layer, x, y, r, g, b, a, z]
 * @return {Object} The pixel object
 */
Pixel.fromArray = function(arr) {
  return new Pixel(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], arr[8]);
};

/**
 * Converts pixel object to flat array
 * @param {Object} pixel - The pixel object
 * @return {Number[]} [layer, x, y, r, g, b, a]
 */
Pixel.toArray = function(pixel) {
  return [pixel.layer, pixel.x, pixel.y, pixel.r, pixel.g, pixel.b, pixel.a];
};

/**
 * Paints a pixel to a canvas element
 * @param {Object} canvas - the canvas DOM element to paint on
 * @param {Number} x - pixel x-coordinate
 * @param {Number} y - pixel y-coordinate
 * @param {String} color - hex-string of color to paint
 */
Pixel.fill = function(canvas, x, y, color) {
  var scale = canvas.width/file.size.width,
      cX = (x-1)*scale,
      cY = (y-1)*scale,
      ctx = canvas.getContext('2d');

  //console.log('filling pixel', cX, cY, scale);

  ctx.fillStyle = color;
  ctx.fillRect(cX, cY, scale, scale);
};

/**
 * Clear a pixel from a canvas element
 * @param {Object} canvas - the canvas DOM element to paint on
 * @param {Number} x - pixel x-coordinate
 * @param {Number} y - pixel y-coordinate
 */
Pixel.clear = function(canvas, x, y) {
  var scale = canvas.clientWidth/file.size.width,
      cX = (x-1)*scale,
      cY = (y-1)*scale,
      ctx = canvas.getContext('2d');

  ctx.clearRect(cX, cY, scale, scale);
};
