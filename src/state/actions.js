export const brightnessToolIntensity = (intensity) => ({ type: "BRIGHTNESSTOOL_INTENSITY", intensity });
export const brightnessToolMode = (mode)  => ({ type: "BRIGHTNESSTOOL_MODE", mode });
export const boxFold = (box) => ({ type: "BOX_FOLD", box });
export const brushColor = (color) => ({ type: "BRUSH_COLOR", color });
export const frameSelect = (frame) => ({ type: "FRAME_SELECT", frame });
export const gridToggle = () => ({ type: "GRID_TOGGLE" });
export const layerAdd = (frame, layer) => ({ type: "LAYER_ADD", frame, layer });
export const layerName = (layer, name) => ({ type: "LAYER_NAME", layer, name });
export const layerSelect = (layer) => ({ type: "LAYER_SELECT", layer });
export const layerOpacity = (layer, opacity) => ({ type: "LAYER_OPACITY", layer, opacity });
export const layerVisibility = (layer, visible) => ({ type: "LAYER_VISIBILITY", layer, visible });
export const onionFrame = (mode, frame) => ({ type: "ONION_FRAME", mode, frame });
export const onionMode = (mode) => ({ type: "ONION_MODE", mode });
export const onionToggle = () => ({ type: "ONION_TOGGLE" });
export const paletteSelect = (palette) => ({ type: "PALETTE_SELECT", palette });
export const toolSelect = (tool) => ({ type: "TOOL_SELECT", tool });
export const zoomIn = () => ({ type: "ZOOM_IN" });
export const zoomOut = () => ({ type: "ZOOM_OUT" });
export const zoomSelect = (zoom) => ({ type: "ZOOM_SELECT", zoom });
export const zoomFit = (fileSize) => ({ type: "ZOOM_FIT", fileSize });
