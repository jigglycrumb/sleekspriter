import initialState from "../initialState";

function uiAppReducer(state = initialState.ui.app, action) {
  switch(action.type) {
  case "MODAL_HIDE":
    return { ...state, modal: { ...state.modal, visible: false }};
  case "MODAL_SHOW":
    return { ...state, modal: { ...state.modal, visible: true, dialog: action.dialog  }};
  default:
    return state;
  }
}

export default uiAppReducer;
