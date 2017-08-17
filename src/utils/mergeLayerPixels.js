import { merge } from "lodash";

const mergeLayerPixels = (frame, first, second, pixels) => {
  if(pixels[frame]
  && pixels[frame][first]
  && pixels[frame][second]) {
    const
      firstLayerPixels = pixels[frame][first],
      secondLayerPixels = pixels[frame][second],
      merged = merge(secondLayerPixels, firstLayerPixels);

    delete pixels[frame][first];
    pixels[frame][second] = merged;
  }

  return pixels;
};

export default mergeLayerPixels;
