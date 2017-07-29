import initialState from "../initialState";

function fileSizeReducer(state = initialState.file.size, action) {

  // console.log(`fileSizeReducer#${action.type}`);

  switch (action.type) {
  case "FILE_CREATE":
    return Object.assign({}, action.size);

  default:
    return state;
  }
}

export default fileSizeReducer;
