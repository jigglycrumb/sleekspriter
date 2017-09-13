import initialState from "../initialState";

function uiExportReducer(state = initialState.ui.export, action) {

  console.log("uiExportReducer", state);

  switch(action.type) {
  // case "SCREEN_SELECT":
  //   return { ...state, screen: action.screen };
  default:
    return state;
  }
}

export default uiExportReducer;
