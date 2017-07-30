export const brightnessToolIntensity = (intensity) => ({ type: "BRIGHTNESSTOOL_INTENSITY", intensity });
export const brightnessToolMode = (mode)  => ({ type: "BRIGHTNESSTOOL_MODE", mode });
export const boxFold = (box) => ({ type: "BOX_FOLD", box });
export const brushColor = (color) => ({ type: "BRUSH_COLOR", color });
export const fileCreate = (frames, size) => ({ type: "FILE_CREATE", frames, size });
export const fileLoad = (json) => ({ type: "FILE_LOAD", json });
export const frameSelect = (frame) => ({ type: "FRAME_SELECT", frame });
export const gridToggle = () => ({ type: "GRID_TOGGLE" });
export const layerAdd = (frame, layer, layers) => ({ type: "LAYER_ADD", frame, layer, layers });
export const layerDelete = (layer) => ({ type: "LAYER_DELETE", layer });
export const layerMoveDown = (frame, layer, z) => ({ type: "LAYER_MOVE_DOWN", frame, layer, z });
export const layerMoveUp = (frame, layer, z) => ({ type: "LAYER_MOVE_UP", frame, layer, z });
export const layerName = (layer, name) => ({ type: "LAYER_NAME", layer, name });
export const layerSelect = (layer) => ({ type: "LAYER_SELECT", layer });
export const layerSelectTop = (layers) => ({ type: "LAYER_SELECT_TOP", layers });
export const layerOpacity = (layer, opacity) => ({ type: "LAYER_OPACITY", layer, opacity });
export const layerVisibility = (layer, visible) => ({ type: "LAYER_VISIBILITY", layer, visible });
export const modalHide = () => ({ type: "MODAL_HIDE" });
export const modalShow = (dialog) => ({ type: "MODAL_SHOW", dialog });
export const onionFrame = (mode, frame) => ({ type: "ONION_FRAME", mode, frame });
export const onionMode = (mode) => ({ type: "ONION_MODE", mode });
export const onionToggle = () => ({ type: "ONION_TOGGLE" });
export const paletteSelect = (palette) => ({ type: "PALETTE_SELECT", palette });
export const pixelsAdd = (frame, layer, pixels) => ({ type: "PIXELS_ADD", frame, layer, pixels });
export const pixelsDelete = (frame, layer, pixels) => ({ type: "PIXELS_DELETE", frame, layer, pixels });
export const pixelsMove = (frame, layer, pixels, distance, size, selection) => ({ type: "PIXELS_MOVE", frame, layer, pixels, distance, size, selection });
export const screenSelect = (screen) => ({ type: "SCREEN_SELECT", screen });
export const selectionClear = () => ({ type: "SELECTION_CLEAR" });
export const selectionEnd = (point) => ({ type: "SELECTION_END", point });
export const selectionMove = (distance) => ({ type: "SELECTION_MOVE", distance });
export const selectionStart = (point) => ({ type: "SELECTION_START", point });
export const toolSelect = (tool) => ({ type: "TOOL_SELECT", tool });
export const zoomIn = () => ({ type: "ZOOM_IN" });
export const zoomOut = () => ({ type: "ZOOM_OUT" });
export const zoomSelect = (zoom) => ({ type: "ZOOM_SELECT", zoom });
export const zoomFit = (fileSize) => ({ type: "ZOOM_FIT", fileSize });
