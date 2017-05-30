export const brightnessToolIntensity = (intensity) => ({ type: "BRIGHTNESSTOOL_INTENSITY", intensity });
export const brightnessToolMode = (mode)  => ({ type: "BRIGHTNESSTOOL_MODE", mode });
export const selectTool = (tool) => ({ type: "SELECT_TOOL", tool });
export const selectZoom = (zoom) => ({ type: "SELECT_ZOOM", zoom });
export const toggleGrid = () => ({ type: "TOGGLE_GRID" });
export const zoomIn = () => ({ type: "ZOOM_IN" });
export const zoomOut = () => ({ type: "ZOOM_OUT" });
export const zoomFit = (fileSize) => ({ type: "ZOOM_FIT", fileSize });
