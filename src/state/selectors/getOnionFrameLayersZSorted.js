// returns an array containing the layers of selected painting frame,
// sorted by z-index. (descending, 0 = lowest)
import { getOnionFrameAbsolute, getFileLayers } from ".";
import { zSorter } from "../../utils";

const getOnionFrameLayersZSorted = state => {
  const frame = getOnionFrameAbsolute(state);
  return getFileLayers(state)
    .filter(layer => layer.frame === frame)
    .sort(zSorter);
};

export default getOnionFrameLayersZSorted;
