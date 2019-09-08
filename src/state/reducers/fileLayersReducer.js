import _ from "lodash";
import initialState from "../initialState";
import { duplicateLayers } from "../../utils";

function fileLayersReducer(state = initialState.file.present.layers, action) {
  switch (action.type) {
    case "FILE_CREATE": {
      const newState = [];
      const totalFrames = action.frames.x * action.frames.y;
      for (let i = 1; i <= totalFrames; i++) {
        newState.push({
          frame: i,
          id: i,
          name: `Layer ${i}`,
          opacity: 100,
          visible: true,
          z: 0,
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
      const { layers, target, nextLayerId } = action;
      const stateCopy = copyState(state).filter(
        layer => layer.frame !== target
      );
      const newLayers = duplicateLayers(layers, target, nextLayerId);
      return stateCopy.concat(newLayers);
    }

    case "LAYER_ADD": {
      const stateCopy = copyState(state);
      const newZIndex =
        action.layers.find(layer => layer.id === action.layer).z + 1;
      const newLayer = {
        frame: action.frame,
        id: action.newLayerId,
        name: `Layer ${action.newLayerId}`,
        z: newZIndex,
        opacity: 100,
        visible: true,
      };

      const ignoredLayers = stateCopy.filter(
        layer => layer.frame !== action.frame
      );
      const layersBelow = stateCopy.filter(
        layer => layer.frame === action.frame && layer.z < newZIndex
      );
      const layersAbove = stateCopy.filter(
        layer => layer.frame === action.frame && layer.z >= newZIndex
      );
      layersAbove.forEach(layer => layer.z++);

      return [...layersBelow, newLayer, ...layersAbove, ...ignoredLayers];
    }
    case "LAYER_DELETE": {
      const stateCopy = copyState(state);
      const layerToDelete = stateCopy.find(layer => layer.id === action.layer);
      const ignoredLayers = stateCopy.filter(
        layer => layer.frame !== layerToDelete.frame
      );
      const layersBelow = stateCopy.filter(
        layer =>
          layer.frame === layerToDelete.frame && layer.z < layerToDelete.z
      );
      const layersAbove = stateCopy.filter(
        layer =>
          layer.frame === layerToDelete.frame && layer.z > layerToDelete.z
      );
      layersAbove.forEach(layer => layer.z++);

      return [...layersBelow, ...layersAbove, ...ignoredLayers];
    }

    case "LAYER_MERGE": {
      const stateCopy = copyState(state);
      const index = _.findIndex(stateCopy, { id: action.first });
      return stateCopy.slice(0, index).concat(stateCopy.slice(index + 1));
    }

    case "LAYER_MOVE_DOWN": {
      const stateCopy = copyState(state);
      const layerToMove = stateCopy.find(layer => layer.id === action.layer);
      const layerBelow = stateCopy.find(
        layer => layer.frame === action.frame && layer.z === action.z - 1
      );
      const ignoredLayers = stateCopy.filter(
        layer =>
          layer.frame !== action.frame ||
          ![layerToMove.id, layerBelow.id].includes(layer.id)
      );

      if (layerBelow) {
        layerToMove.z--;
        layerBelow.z++;

        return [...ignoredLayers, layerToMove, layerBelow];
      } else return stateCopy;
    }

    case "LAYER_MOVE_UP": {
      const stateCopy = copyState(state);
      const layerToMove = stateCopy.find(layer => layer.id === action.layer);
      const layerAbove = stateCopy.find(
        layer => layer.frame === action.frame && layer.z === action.z + 1
      );
      const ignoredLayers = stateCopy.filter(
        layer =>
          layer.frame !== action.frame ||
          ![layerToMove.id, layerAbove.id].includes(layer.id)
      );

      if (layerAbove) {
        layerToMove.z++;
        layerAbove.z--;

        return [...ignoredLayers, layerToMove, layerAbove];
      } else return stateCopy;
    }

    case "LAYER_NAME":
      return state.map(layer => {
        const l = Object.assign({}, layer);
        if (l.id === action.layer) {
          l.name = action.name;
        }
        return l;
      });

    case "LAYER_OPACITY":
      return state.map(layer => {
        const l = Object.assign({}, layer);
        if (l.id === action.layer) {
          l.opacity = +action.opacity;
        }
        return l;
      });

    case "LAYER_VISIBILITY":
      return state.map(layer => {
        const l = Object.assign({}, layer);
        if (l.id === action.layer) {
          l.visible = !l.visible;
        }
        return l;
      });

    default:
      return state;
  }
}

export default fileLayersReducer;

// helper functions
const copyState = state => state.map(layer => Object.assign({}, layer));
