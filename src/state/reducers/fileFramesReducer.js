import initialState from "../initialState";

function fileFramesReducer(state = initialState.file.frames, action) {

  console.log(`fileFramesReducer#${action.type}`);

  switch (action.type) {

  default:
    return state;
  }
}

export default fileFramesReducer;
