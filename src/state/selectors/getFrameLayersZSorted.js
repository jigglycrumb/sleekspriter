// returns an array containing the layers of selected painting frame,
// sorted by z-index. (0 = lowest, higher values stack on top)
import { getPaintFrame, getFileLayers } from ".";
import { zSorter } from "../../utils";

const getFrameLayersZSorted = state => {
  const frame = getPaintFrame(state);
  const layers = getFileLayers(state);
  return layers.filter(layer => layer.frame === frame).sort(zSorter);
};

export default getFrameLayersZSorted;
