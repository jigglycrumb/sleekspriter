// returns an array containing the layers of selected painting frame,
// sorted by z-index. (0 = lowest, higher values stack on top)
import { createSelector } from "reselect";
import { getPaintFrame, getFileLayers } from "./inputSelectors";

const getFrameLayersZSorted = createSelector(
  [ getPaintFrame, getFileLayers ],
  (frame, layers) => layers
    .filter(layer => layer.frame === frame)
    .sort(zSorter)
);


const zSorter = function(a, b) {
  if(a.z > b.z) return -1;
  if(a.z < b.z) return 1;
  return 0;
};

export default getFrameLayersZSorted;
