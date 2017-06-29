import { combineReducers } from "redux";
import fileFramesReducer from "./fileFramesReducer";
import fileLayersReducer from "./fileLayersReducer";
import filePixelsReducer from "./filePixelsReducer";
import fileSizeReducer from "./fileSizeReducer";

const fileReducer = combineReducers({
  frames: fileFramesReducer,
  layers: fileLayersReducer,
  pixels: filePixelsReducer,
  size: fileSizeReducer,
});

export default fileReducer;
