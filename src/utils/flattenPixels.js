import { Pixel } from "../classes";

const flattenPixels = (pixels = {}, flattenedPixels = []) => {
  const keys = Object.keys(pixels),
    values = Object.values(pixels);

  if (keys.length > 0) {
    if (keys.every(key => !isNaN(key))) {
      // if every key is a number, go one level deeper
      values.map(value => flattenPixels(value, flattenedPixels));
    } else {
      // if keys are not numerical, it is a pixel
      const { frame, layer, x, y, r, g, b, a } = pixels;
      flattenedPixels.push(new Pixel(frame, layer, x, y, r, g, b, a));
    }
  }

  return flattenedPixels;
};

export default flattenPixels;
