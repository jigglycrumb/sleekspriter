import _ from "lodash";
import initialState from "../initialState";

function fileLayersReducer(state = initialState.file.layers, action) {
  switch (action.type) {
  case "FILE_CREATE": {
    let newState = [];
    const totalFrames = action.frames.x * action.frames.y;
    for(let i = 1; i <= totalFrames; i++ ) {
      newState.push({
        frame: i,
        id: i,
        name: `Layer ${i}`,
        opacity: 100,
        visible: true,
        z: 0
      });
    }

    return newState;
  }

  case "FILE_LOAD":
    return [].concat(action.json.layers);

  case "FILE_SIZE": {
    // TODO implement this

    return state;
  }

  case "FRAME_DUPLICATE": {
    // TODO implement this
    return state;
  }

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

  case "LAYER_MERGE": {
    const index = _.findIndex(state, { id: action.first });
    return state.slice(0, index).concat(state.slice(index+1));
  }

  case "LAYER_MOVE_DOWN": {
    const
      layerToMove = state.find(layer => layer.id === action.layer),
      layerBelow = state.find(layer => layer.frame === action.frame && layer.z === action.z - 1),
      ignoredLayers = state.filter(layer => layer.frame !== action.frame || ![layerToMove.id, layerBelow.id].includes(layer.id));

    if(layerBelow) {
      layerToMove.z--;
      layerBelow.z++;

      return [...ignoredLayers, layerToMove, layerBelow];
    }
    else return state;
  }

  case "LAYER_MOVE_UP": {
    const
      layerToMove = state.find(layer => layer.id === action.layer),
      layerAbove = state.find(layer => layer.frame === action.frame && layer.z === action.z + 1),
      ignoredLayers = state.filter(layer => layer.frame !== action.frame || ![layerToMove.id, layerAbove.id].includes(layer.id));

    if(layerAbove) {
      layerToMove.z++;
      layerAbove.z--;

      return [...ignoredLayers, layerToMove, layerAbove];
    }
    else return state;
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
