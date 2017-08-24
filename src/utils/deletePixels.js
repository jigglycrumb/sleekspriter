import { dissoc } from "sprout-data";

const deletePixels = (allPixels, frame, layer, pixelsToDelete) => {
  Object.keys(pixelsToDelete).map(x => {
    Object.keys(pixelsToDelete[x]).map(y => {
      allPixels = dissoc(allPixels, [frame, layer, x, y]);
    });
  });
  return allPixels;
};

export default deletePixels;
