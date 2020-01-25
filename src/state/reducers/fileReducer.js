import { combineReducers } from "redux";
import undoable from "redux-undo";

import fileFramesReducer from "./fileFramesReducer";
import fileLayersReducer from "./fileLayersReducer";
import fileMetaReducer from "./fileMetaReducer";
import filePixelsReducer from "./filePixelsReducer";
import fileSizeReducer from "./fileSizeReducer";

const fileReducer = undoable(
  combineReducers({
    meta: fileMetaReducer,
    frames: fileFramesReducer,
    layers: fileLayersReducer,
    pixels: filePixelsReducer,
    size: fileSizeReducer,
  }),
  {
    limit: 10, // set a limit for the history // TODO historybox settings
  }
);

export default fileReducer;
