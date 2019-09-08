// returns the total number of frames in the file
import { maxBy } from "lodash";
import { getFileLayers } from ".";

const getNewLayerId = state => {
  const layers = getFileLayers(state);
  return maxBy(layers, layer => layer.id).id + 1;
};

export default getNewLayerId;
