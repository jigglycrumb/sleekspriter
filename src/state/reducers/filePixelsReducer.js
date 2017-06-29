import initialState from "../initialState";

function filePixelsReducer(state = initialState.file.pixels, action) {
  switch (action.type) {

  case "PIXELS_ADD": {
    let px;
    try {
      px = state[action.frame][action.layer];
    } catch (e) {
      px = {};
    }

    const newPx = Object.assign(px, action.pixels);
    return Object.assign(state, {
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
