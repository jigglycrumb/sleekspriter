// returns an object containing the data of the currently selected painting layer
import { createSelector } from "reselect";
import { getPaintLayerId, getFileLayers } from "./inputSelectors";

const getSelectedPaintLayer = createSelector(
  [ getPaintLayerId, getFileLayers ],
  (id, layers) => layers.find(layer => layer.id === id)
);

export default getSelectedPaintLayer;
