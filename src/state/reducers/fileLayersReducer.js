import _ from "lodash";
import initialState from "../initialState";

function fileLayersReducer(state = initialState.file.layers, action) {

  console.log(`fileLayersReducer#${action.type}`);

  switch (action.type) {

  case "LAYER_ADD":
    const selectedLayer = action.layer;
    const layer = {frame: action.frame, id: 666, name: "SATAN", z: 1, opacity: 100, visible: true};
    return [...state, layer];

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
