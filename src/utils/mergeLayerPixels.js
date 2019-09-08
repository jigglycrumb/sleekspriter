import { merge } from "lodash";
import { assoc, dissoc, get } from "sprout-data";

// TODO this is buggy on undo

const mergeLayerPixels = (frame, first, second, pixels = {}) => {
  const firstLayerPixels = get(pixels, [frame, first], {});
  const secondLayerPixels = get(pixels, [frame, second], {});
  const merged = merge(secondLayerPixels, firstLayerPixels);

  pixels = dissoc(pixels, [frame, first]);
  pixels = assoc(pixels, [frame, second], merged);

  return pixels;
};

export default mergeLayerPixels;
