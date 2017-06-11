// state input selectors for the memoized reselect selectors
export const getFileFrames = (state) => state.file.frames;
export const getFileLayers = (state) => state.file.layers;
export const getOnion = (state) => state.ui.paint.onion;
export const getPaintFrame = (state) => state.ui.paint.frame;
export const getPaintLayerId = (state) => state.ui.paint.layer;
