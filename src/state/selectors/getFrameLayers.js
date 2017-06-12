// returns an array containing the layers of selected painting frame
import { createSelector } from "reselect";
import { getPaintFrame, getFileLayers } from "./inputSelectors";

const getFrameLayers = createSelector(
  [ getPaintFrame, getFileLayers ],
  (frame, layers) => layers.filter(layer => layer.frame === frame)
);

export default getFrameLayers;
