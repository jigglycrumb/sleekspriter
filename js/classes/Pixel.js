var Pixel = function(layer, x, y, r, g, b, a) {
  this.layer = layer;
  this.x = x;
  this.y = y;
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
};

Pixel.prototype = new Point();
Pixel.prototype.constructor = Pixel;

Pixel.fromArray = function(arr) {
  return new Pixel(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]);
};

Pixel.toArray = function(pixel) {
  return [pixel.layer, pixel.x, pixel.y, pixel.r, pixel.g, pixel.b, pixel.a];
};