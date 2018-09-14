import { combineReducers } from "redux";
import undoable, { distinctState } from "redux-undo";

import fileFramesReducer from "./fileFramesReducer";
import fileLayersReducer from "./fileLayersReducer";
import filePixelsReducer from "./filePixelsReducer";
import fileSizeReducer from "./fileSizeReducer";

const fileReducer = undoable(
  combineReducers({
    frames: fileFramesReducer,
    layers: fileLayersReducer,
    pixels: filePixelsReducer,
    size: fileSizeReducer,
  }),
  {
    filter: distinctState(),
    limit: 10, // set a limit for the history
  }
);

export default fileReducer;
