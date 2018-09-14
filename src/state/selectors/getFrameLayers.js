// returns an array containing the layers of selected painting frame
import { getPaintFrame, getFileLayers } from "./inputSelectors";

const getFrameLayers = state => {
  const frame = getPaintFrame(state);
  const layers = getFileLayers(state);
  return layers.filter(layer => layer.frame === frame);
};

export default getFrameLayers;
