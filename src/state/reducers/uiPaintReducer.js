import initialState from "../initialState";
import config from "../../config";

const { zoom, offset } = config;

function uiPaintReducer(state = initialState.ui.paint, action) {

  console.log(`uiPaintReducer#${action.type}`);

  let newZoom;

  switch (action.type) {
  case "BRIGHTNESSTOOL_INTENSITY":
    return { ...state, brightnessTool: { mode: state.brightnessTool.mode, intensity: +action.intensity }};
  case "BRIGHTNESSTOOL_MODE":
    return { ...state, brightnessTool: { mode: action.mode, intensity: state.brightnessTool.intensity }};
  case "FOLD_BOX":
    return { ...state, fold: { ...state.fold, [action.box]: !state.fold[action.box] }};
  case "FRAME_SELECT":
    return { ...state, frame: +action.frame };
  case "LAYER_SELECT":
    return { ...state, layer: +action.layer };
  case "SELECT_TOOL":
    return { ...state, tool: action.tool };
  case "SELECT_ZOOM":
    return { ...state, zoom: +action.zoom };
  case "TOGGLE_GRID":
    return { ...state, grid: !state.grid };
  case "TOGGLE_ONION":
    return { ...state, onion: { ...state.onion, active: !state.onion.active }};
  case "ZOOM_IN":
    newZoom = state.zoom + 1;
    if(newZoom > zoom.max) newZoom = zoom.max;
    return { ...state, zoom: newZoom };
  case "ZOOM_OUT":
    newZoom = state.zoom - 1;
    if(newZoom < zoom.min) newZoom = zoom.min;
    return { ...state, zoom: newZoom };
  case "ZOOM_FIT":
    newZoom = Math.floor((window.innerHeight - offset.top - offset.bottom) / action.fileSize.height);
    if((action.fileSize.width * newZoom) > (window.innerWidth - offset.left - offset.right)) {
      newZoom = Math.floor((window.innerWidth - offset.left - offset.right) / action.fileSize.width);
    }
    return { ...state, zoom: newZoom };

  default:
    return state;
  }
}

export default uiPaintReducer;
