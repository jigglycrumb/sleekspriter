export const brightnessToolIntensity = intensity => ({
  type: "BRIGHTNESSTOOL_INTENSITY",
  intensity,
});
export const brightnessToolMode = mode => ({
  type: "BRIGHTNESSTOOL_MODE",
  mode,
});
export const boxFold = box => ({ type: "BOX_FOLD", box });
export const brushColor = color => ({ type: "BRUSH_COLOR", color });
export const colorReplace = (
  color,
  newColor,
  scope,
  frame,
  layer,
  selection,
  size,
  pixels
) => ({
  type: "COLOR_REPLACE",
  color,
  newColor,
  scope,
  frame,
  layer,
  selection,
  size,
  pixels,
});
export const exportBackground = background => ({
  type: "EXPORT_BACKGROUND",
  background,
});
export const exportFormat = format => ({ type: "EXPORT_FORMAT", format });
export const exportFrame = frame => ({ type: "EXPORT_FRAME", frame });
export const exportPart = part => ({ type: "EXPORT_PART", part });
export const exportStatus = status => ({ type: "EXPORT_STATUS", status });
export const exportZoom = zoom => ({ type: "EXPORT_ZOOM", zoom });
export const fileCreate = (frames, size) => ({
  type: "FILE_CREATE",
  frames,
  size,
});
export const fileLoad = json => ({ type: "FILE_LOAD", json });
export const fileSize = (frames, size) => ({ type: "FILE_SIZE", frames, size });
export const frameDuplicate = (layers, source, target, nextLayerId) => ({
  type: "FRAME_DUPLICATE",
  layers,
  source,
  target,
  nextLayerId,
});
export const frameFlipHorizontal = (frame, pixels, pivot, size) => ({
  type: "FRAME_FLIP_HORIZONTAL",
  frame,
  pixels,
  pivot,
  size,
});
export const frameFlipVertical = (frame, pixels, pivot, size) => ({
  type: "FRAME_FLIP_VERTICAL",
  frame,
  pixels,
  pivot,
  size,
});
export const frameRotate = (frame, pixels, angle, pivot, size) => ({
  type: "FRAME_ROTATE",
  frame,
  pixels,
  angle,
  pivot,
  size,
});
export const frameSelect = frame => ({ type: "FRAME_SELECT", frame });
export const gridToggle = () => ({ type: "GRID_TOGGLE" });
export const layerAdd = (newLayerId, frame, layer, layers) => ({
  type: "LAYER_ADD",
  newLayerId,
  frame,
  layer,
  layers,
});
export const layerDelete = (frame, layer, allPixels) => ({
  type: "LAYER_DELETE",
  frame,
  layer,
  allPixels,
});
export const layerMerge = (frame, first, second, allPixels) => ({
  type: "LAYER_MERGE",
  frame,
  first,
  second,
  allPixels,
});
export const layerMoveDown = (frame, layer, z) => ({
  type: "LAYER_MOVE_DOWN",
  frame,
  layer,
  z,
});
export const layerMoveUp = (frame, layer, z) => ({
  type: "LAYER_MOVE_UP",
  frame,
  layer,
  z,
});
export const layerName = (layer, name) => ({ type: "LAYER_NAME", layer, name });
export const layerSelect = layer => ({ type: "LAYER_SELECT", layer });
export const layerSelectTop = layers => ({ type: "LAYER_SELECT_TOP", layers });
export const layerOpacity = (layer, opacity) => ({
  type: "LAYER_OPACITY",
  layer,
  opacity,
});
export const layerVisibility = (layer, visible) => ({
  type: "LAYER_VISIBILITY",
  layer,
  visible,
});
export const modalHide = () => ({ type: "MODAL_HIDE" });
export const modalShow = dialog => ({ type: "MODAL_SHOW", dialog });
export const onionFrame = (mode, frame) => ({
  type: "ONION_FRAME",
  mode,
  frame,
});
export const onionMode = mode => ({ type: "ONION_MODE", mode });
export const onionToggle = () => ({ type: "ONION_TOGGLE" });
export const paletteSelect = palette => ({ type: "PALETTE_SELECT", palette });
export const pixelsAdd = (frame, layer, pixels) => ({
  type: "PIXELS_ADD",
  frame,
  layer,
  pixels,
});
export const pixelsCopy = (frame, layer, pixels) => ({
  type: "PIXELS_COPY",
  frame,
  layer,
  pixels,
});
export const pixelsCut = (frame, layer, pixels, allPixels) => ({
  type: "PIXELS_CUT",
  frame,
  layer,
  pixels,
  allPixels,
});
export const pixelsDelete = (frame, layer, pixels, allPixels) => ({
  type: "PIXELS_DELETE",
  frame,
  layer,
  pixels,
  allPixels,
});
export const pixelsFlipHorizontal = (frame, layer, pixels, pivot, size) => ({
  type: "PIXELS_FLIP_HORIZONTAL",
  frame,
  layer,
  pixels,
  pivot,
  size,
});
export const pixelsFlipVertical = (frame, layer, pixels, pivot, size) => ({
  type: "PIXELS_FLIP_VERTICAL",
  frame,
  layer,
  pixels,
  pivot,
  size,
});
export const pixelsMove = (frame, layer, pixels, distance, size) => ({
  type: "PIXELS_MOVE",
  frame,
  layer,
  pixels,
  distance,
  size,
});
export const pixelsPaste = (frame, layer, pixels) => ({
  type: "PIXELS_PASTE",
  frame,
  layer,
  pixels,
});
export const pixelsRotate = (frame, layer, pixels, angle, pivot, size) => ({
  type: "PIXELS_ROTATE",
  frame,
  layer,
  pixels,
  angle,
  pivot,
  size,
});
export const screenSelect = screen => ({ type: "SCREEN_SELECT", screen });
export const selectionClear = () => ({ type: "SELECTION_CLEAR" });
export const selectionEnd = point => ({ type: "SELECTION_END", point });
export const selectionMove = distance => ({ type: "SELECTION_MOVE", distance });
export const selectionStart = point => ({ type: "SELECTION_START", point });
export const toolSelect = tool => ({ type: "TOOL_SELECT", tool });
export const windowResize = () => ({ type: "WINDOW_RESIZE" });
export const zoomIn = () => ({ type: "ZOOM_IN" });
export const zoomOut = () => ({ type: "ZOOM_OUT" });
export const zoomSelect = zoom => ({ type: "ZOOM_SELECT", zoom });
export const zoomFit = fileSize => ({ type: "ZOOM_FIT", fileSize });
