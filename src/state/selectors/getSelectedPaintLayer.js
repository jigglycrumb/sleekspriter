// returns an object containing the data of the currently selected painting layer
import { createSelector } from "reselect";

const getSelectedPaintLayerId = (state) => state.ui.paint.layer;
const getFileLayers = (state) => state.file.layers;

const getSelectedPaintLayer = createSelector(
  [ getSelectedPaintLayerId, getFileLayers ],
  (id, layers) => layers.find(layer => layer.id === id)
);

export default getSelectedPaintLayer;
