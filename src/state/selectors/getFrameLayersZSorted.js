// returns an array containing the layers of selected painting frame,
// sorted by z-index. (descending, 0 = lowest)
import { getFrameLayers } from ".";
import { zSorter } from "../../utils";

const getFrameLayersZSorted = state => {
  return getFrameLayers(state).sort(zSorter);
};

export default getFrameLayersZSorted;
