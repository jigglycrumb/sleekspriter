import flattenPixels from "./flattenPixels";
import insideBounds from "./insideBounds";
import inflatePixels from "./inflatePixels";

function manipulatePixels(pixels, callback, size) {
  pixels = flattenPixels(pixels);
  pixels.forEach(callback);

  if (size) pixels = pixels.filter(pixel => insideBounds(size, pixel)); // delete out of stage pixels

  pixels = inflatePixels(pixels);
  return pixels;
}

// callbacks

export function movePixel(distance, bounds, pixel) {
  if (insideBounds(bounds, pixel)) return pixel.translate(distance);
  else return pixel;
}

export default manipulatePixels;
