import { combineReducers } from "redux";
import fileSizeReducer from "./fileSizeReducer";
import fileLayersReducer from "./fileLayersReducer";

const fileReducer = combineReducers({
  size: fileSizeReducer,
  layers: fileLayersReducer,
});

export default fileReducer;
