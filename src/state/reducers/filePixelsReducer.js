import initialState from "../initialState";
import _ from "lodash";

function filePixelsReducer(state = initialState.file.pixels, action) {
  switch (action.type) {

  case "PIXELS_ADD": {
    let px;
    try {
      px = state[action.frame][action.layer];
    } catch (e) {
      px = {};
    }

    const newPx = _.merge(px, action.pixels);
    return _.merge(state, {
      [action.frame]: {
        [action.layer]: newPx
      }
    });
  }

  default:
    return state;
  }
}

export default filePixelsReducer;
