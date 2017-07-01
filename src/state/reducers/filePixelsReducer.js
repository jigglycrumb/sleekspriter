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

  default:
    return state;
  }
}

export default filePixelsReducer;
