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
  case "BOX_FOLD":
    return { ...state, fold: { ...state.fold, [action.box]: !state.fold[action.box] }};
  case "BRUSH_COLOR":
    return { ...state, color: action.color };
  case "FRAME_SELECT":
    return { ...state, frame: +action.frame };
  case "GRID_TOGGLE":
    return { ...state, grid: !state.grid };
  case "LAYER_SELECT":
    return { ...state, layer: +action.layer };
  case "ONION_FRAME":
    return { ...state, onion: { ...state.onion, frame: { ...state.onion.frame, [action.mode]: +action.frame }}};
  case "ONION_MODE":
    return { ...state, onion: { ...state.onion, mode: action.mode }};
  case "ONION_TOGGLE":
    return { ...state, onion: { ...state.onion, active: !state.onion.active }};
  case "PALETTE_SELECT":
    return { ...state, palette: action.palette };
  case "TOOL_SELECT":
    return { ...state, tool: action.tool };
  case "ZOOM_IN":
    newZoom = state.zoom + 1;
    if(newZoom > zoom.max) newZoom = zoom.max;
    return { ...state, zoom: newZoom };
  case "ZOOM_OUT":
    newZoom = state.zoom - 1;
    if(newZoom < zoom.min) newZoom = zoom.min;
    return { ...state, zoom: newZoom };
  case "ZOOM_SELECT":
    return { ...state, zoom: +action.zoom };
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
