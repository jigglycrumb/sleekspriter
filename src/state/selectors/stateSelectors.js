// state input selectors
export const getExportBackground = state => state.ui.export.background;
export const getExportFormat = state => state.ui.export.format;
export const getExportFrame = state => state.ui.export.frame;
export const getExportPart = state => state.ui.export.part;
export const getExportStatus = state => state.ui.export.status;
export const getExportZoom = state => state.ui.export.zoom;

export const getFileData = state => state.file.present;
export const getFileMeta = state => state.file.present.meta; // not used yet
export const getFileFrames = state => state.file.present.frames;
export const getFileLayers = state => state.file.present.layers;
export const getFilePixels = state => state.file.present.pixels;
export const getFileSize = state => state.file.present.size;

export const getBrightnessTool = state => state.ui.paint.brightnessTool;
export const getBrushColor = state => state.ui.paint.color;
export const getClipboard = state => state.ui.paint.clipboard;
export const getFold = state => state.ui.paint.fold;
export const getGrid = state => state.ui.paint.grid;
export const getOnion = state => state.ui.paint.onion;
export const getPaintFrame = state => state.ui.paint.frame;
export const getPaintLayerId = state => state.ui.paint.layer;
export const getSelection = state => state.ui.paint.selection;
export const getPalette = state => state.ui.paint.palette;
export const getSpritePalette = state => state.ui.paint.spritePalette;
export const getTool = state => state.ui.paint.tool;
export const getZoom = state => state.ui.paint.zoom;

export const getFile = state => state.ui.app.file;
export const getModal = state => state.ui.app.modal;
export const getScreen = state => state.ui.app.screen;
