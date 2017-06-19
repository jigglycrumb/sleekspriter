import _ from "lodash";
import initialState from "../initialState";

function fileLayersReducer(state = initialState.file.layers, action) {
  switch (action.type) {

  case "LAYER_ADD": {
    // create new layer
    const
      selectedFrame = action.frame,
      selectedLayer = action.layer,
      newZIndex = action.layers.find(layer => layer.id === selectedLayer).z + 1,
      newId = (_.max(state, function(layer) { return layer.id; })).id + 1,
      newLayer = {
        frame: selectedFrame,
        id: newId,
        name: `Layer ${newId}`,
        z: newZIndex,
        opacity: 100,
        visible: true
      };

    // fix z index of layers above new layer
    const ignoredLayers = state.filter(layer => layer.frame !== selectedFrame);
    const layersBelow = state.filter(layer => layer.frame === selectedFrame && layer.z < newZIndex);
    const layersAbove = state.filter(layer => layer.frame === selectedFrame && layer.z >= newZIndex);
    layersAbove.forEach(layer => layer.z++);

    return [...layersBelow, newLayer, ...layersAbove, ...ignoredLayers];
  }
  case "LAYER_NAME":
    return state.map(function(layer) {
      if(layer.id === action.layer) {
        layer.name = action.name;
      }
      return layer;
    });

  case "LAYER_OPACITY":
    return state.map(function(layer) {
      if(layer.id === action.layer) {
        layer.opacity = +action.opacity;
      }
      return layer;
    });

  case "LAYER_VISIBILITY":
    return state.map(function(layer) {
      if(layer.id === action.layer) {
        layer.visible = !layer.visible;
      }
      return layer;
    });

  default:
    return state;
  }
}

export default fileLayersReducer;
