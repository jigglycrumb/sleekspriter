// returns an object containing the data of the currently selected painting layer
import { getPaintLayerId, getFileLayers } from ".";

const getPaintLayer = state => {
  const id = getPaintLayerId(state);
  const layers = getFileLayers(state);
  return layers.find(layer => layer.id === id);
};

export default getPaintLayer;
