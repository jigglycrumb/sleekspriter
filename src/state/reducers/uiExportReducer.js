import initialState from "../initialState";

function uiExportReducer(state = initialState.ui.export, action) {
  switch(action.type) {
  case "EXPORT_FORMAT":
    return { ...state, format: action.format };
  case "EXPORT_FRAME":
    return { ...state, frame: action.frame };
  case "EXPORT_PART":
    return { ...state, part: action.part };
  case "EXPORT_STATUS":
    return { ...state, status: action.status };
  case "EXPORT_ZOOM":
    return { ...state, zoom: action.zoom };
  default:
    return state;
  }
}

export default uiExportReducer;
