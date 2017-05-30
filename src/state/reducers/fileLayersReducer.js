import initialState from "../initialState";

function fileLayersReducer(state = initialState.file.layers, action) {

  console.log(`fileLayersReducer#${action.type}`);

  switch (action.type) {

  default:
    return state;
  }
}

export default fileLayersReducer;
