import { merge } from "lodash";
import sprout from "sprout-data";

// TODO this is buggy on undo

const mergeLayerPixels = (frame, first, second, pixels = {}) => {
  const firstLayerPixels = sprout.get(pixels, [frame, first], {});
  const secondLayerPixels = sprout.get(pixels, [frame, second], {});
  const merged = merge(secondLayerPixels, firstLayerPixels);

  pixels = sprout.dissoc(pixels, [frame, first]);
  pixels = sprout.assoc(pixels, [frame, second], merged);

  return pixels;
};

export default mergeLayerPixels;
