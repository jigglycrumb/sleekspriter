import initialState from "../initialState";

function fileFramesReducer(state = initialState.file.frames, action) {
  switch (action.type) {

  case "FILE_CREATE":
    return Object.assign({}, action.frames);

  default:
    return state;
  }
}

export default fileFramesReducer;
