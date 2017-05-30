import initialState from "../initialState";

function cacheReducer(state = initialState.cache, action) {

  console.log(`cacheReducer#${action.type}`);

  switch (action.type) {

  default:
    return state;
  }
}

export default cacheReducer;
