import { combineReducers } from "redux";
import fileFramesReducer from "./fileFramesReducer";
import fileLayersReducer from "./fileLayersReducer";
import fileSizeReducer from "./fileSizeReducer";

const fileReducer = combineReducers({
  frames: fileFramesReducer,
  layers: fileLayersReducer,
  size: fileSizeReducer,
});

export default fileReducer;
