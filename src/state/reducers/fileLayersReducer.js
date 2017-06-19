import _ from "lodash";
import initialState from "../initialState";

function fileLayersReducer(state = initialState.file.layers, action) {
  switch (action.type) {

  case "LAYER_ADD": {
    const
      newZIndex = action.layers.find(layer => layer.id === action.layer).z + 1,
      newId = (_.max(state, function(layer) { return layer.id; })).id + 1,
      newLayer = {
        frame: action.frame,
        id: newId,
        name: `Layer ${newId}`,
        z: newZIndex,
        opacity: 100,
        visible: true
      };

    const
      ignoredLayers = state.filter(layer => layer.frame !== action.frame),
      layersBelow = state.filter(layer => layer.frame === action.frame && layer.z < newZIndex),
      layersAbove = state.filter(layer => layer.frame === action.frame && layer.z >= newZIndex);
    layersAbove.forEach(layer => layer.z++);

    return [...layersBelow, newLayer, ...layersAbove, ...ignoredLayers];
  }
  case "LAYER_DELETE": {
    const
      layerToDelete = state.find(layer => layer.id === action.layer),
      ignoredLayers = state.filter(layer => layer.frame !== layerToDelete.frame),
      layersBelow = state.filter(layer => layer.frame === layerToDelete.frame && layer.z < layerToDelete.z),
      layersAbove = state.filter(layer => layer.frame === layerToDelete.frame && layer.z > layerToDelete.z);
    layersAbove.forEach(layer => layer.z++);

    return [...layersBelow, ...layersAbove, ...ignoredLayers];
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
