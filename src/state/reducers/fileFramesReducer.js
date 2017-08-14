import initialState from "../initialState";

function fileFramesReducer(state = initialState.file.frames, action) {
  switch (action.type) {

  case "FILE_CREATE":
    return action.frames;

  case "FILE_LOAD":
    return action.json.frames;

  case "FILE_SIZE":
    return action.frames;

  default:
    return state;
  }
}

export default fileFramesReducer;
