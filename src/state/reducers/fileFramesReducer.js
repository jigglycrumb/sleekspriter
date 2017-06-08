import initialState from "../initialState";

function fileFramesReducer(state = initialState.file.frames, action) {
  switch (action.type) {

  default:
    return state;
  }
}

export default fileFramesReducer;
