import initialState from "../initialState";
import _ from "lodash";

function filePixelsReducer(state = initialState.file.pixels, action) {
  switch (action.type) {

  case "PIXELS_ADD": {
    if(state[action.frame] == undefined) state[action.frame] = {};
    if(state[action.frame][action.layer] == undefined) state[action.frame][action.layer] = {};

    const
      px = state[action.frame][action.layer],
      newPx = _.merge(px, action.pixels);

    return Object.assign({}, _.merge(state, {
      [action.frame]: {
        [action.layer]: newPx
      }
    }));
  }

  case "PIXELS_DELETE": {
    const
      stateCopy = Object.assign({}, state),
      xValues = Object.keys(action.pixels);

    xValues.map(x => {
      const yValues = Object.keys(action.pixels[x]);
      yValues.map(y => {
        delete stateCopy[action.frame][action.layer][x][y];
      });

      if(Object.getOwnPropertyNames(stateCopy[action.frame][action.layer][x]).length === 0) {
        delete stateCopy[action.frame][action.layer][x];
      }
    });

    if(Object.getOwnPropertyNames(stateCopy[action.frame][action.layer]).length === 0) {
      delete stateCopy[action.frame][action.layer];
    }
    if(Object.getOwnPropertyNames(stateCopy[action.frame]).length === 0) {
      delete stateCopy[action.frame];
    }

    return stateCopy;
  }

  default:
    return state;
  }
}

export default filePixelsReducer;
