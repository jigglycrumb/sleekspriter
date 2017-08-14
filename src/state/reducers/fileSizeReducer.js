import initialState from "../initialState";

function fileSizeReducer(state = initialState.file.size, action) {
  switch (action.type) {
  case "FILE_CREATE":
    return action.size;

  case "FILE_LOAD":
    return action.json.size;

  case "FILE_SIZE":
    return action.size;

  default:
    return state;
  }
}

export default fileSizeReducer;
